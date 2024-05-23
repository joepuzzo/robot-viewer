from pyee import EventEmitter
from debug import Debug
import threading

logger = Debug('mock:motor\t')

class Motor(EventEmitter):
    def __init__(self, id, homePos, limNeg=None, limPos=None, maxSpeed=40, maxAccel=20):
        super().__init__()
        self.id = id
        self.homePos = homePos
        self.limNeg = limNeg
        self.limPos = limPos
        self.maxSpeed = maxSpeed
        self.maxAccel = maxAccel
        self.currentPos = homePos
        self.goalPos = homePos
        self.moving = False
        self.homing = False
        self.enabled = False
        self.error = None
        logger(f'Motor {self.id} created with homePos {self.homePos}')

    @property
    def state(self):
        return {
            'id': self.id,
            'homing': self.homing,
            'home': self.homePos,
            'enabled': self.enabled,
            'error': self.error,
            'moving': self.moving,
            'currentPos': self.currentPos,
            'goalPos': self.goalPos,
        }

    def validate(self, enabled=False, cleared=False, log=''):
        if enabled and not self.enabled:
            message = f'Please enable before {log}'
            logger(message)
            self.error = 'DISABLED'
            self.emit('meta')
            return False
        if cleared and self.error:
            message = f'Please clear error before {log}'
            logger(message)
            self.error = 'CLEAR_ERROR'
            self.emit('meta')
            return False
        return True

    def set_position(self, position, spd=None, acc=None):
        speed = spd or self.maxSpeed
        acceleration = acc or self.maxAccel

        if not self.validate(enabled=True, cleared=True, log='attempting to set position'):
            return

        logger(f'Motor {self.id} setPosition called with position {position}, speed {speed}, acceleration {acceleration}')
        self.goalPos = position
        self.moving = True

        distance = abs(self.goalPos - self.currentPos)
        direction = 1 if self.goalPos > self.currentPos else -1
        interval = 0.1  # Update every 100 ms
        step = (speed * interval) * direction  # Degrees per interval

        logger(f'Motor {self.id} will be moving in steps of {step}')

        def move():
            if self.moving:
                if abs(self.goalPos - self.currentPos) < abs(step):
                    self.currentPos = self.goalPos
                    self.moving = False
                    logger(f'Motor {self.id} reached goal position {self.goalPos}')
                    self.emit('moved', self.id)
                    self.emit('pulse', self.id, self.currentPos)
                    if self.homing:
                        self.homing = False
                        logger(f'Motor {self.id} finished homing')
                        self.emit('home', self.id)
                elif not self.enabled:
                    logger(f'Motor {self.id} was moving to {self.goalPos} but was stopped at {self.currentPos}')
                    self.goalPos = self.currentPos
                    self.moving = False
                    self.homing = False
                    self.emit('moved', self.id)
                    self.emit('pulse', self.id, self.currentPos)
                else:
                    self.currentPos += step
                    self.emit('pulse', self.id, self.currentPos)
                    threading.Timer(interval, move).start()

        move()

    def go_home(self):
        logger(f'Motor {self.id} going home to {self.homePos}')
        if not self.validate(enabled=True, cleared=True, log='attempting to home'):
            return
        self.homing = True
        self.set_position(self.homePos)

    def reset_errors(self):
        logger(f'Motor {self.id} resetting errors')
        self.error = None
        self.emit('reset')

    def enable(self):
        logger(f'Motor {self.id} enabled')
        self.enabled = True
        self.emit('enabled')

    def disable(self):
        logger(f'Motor {self.id} disabled')
        self.enabled = False
        self.emit('disabled')

    def freeze(self):
        logger(f'Motor {self.id} freeze called')
        self.moving = False
        self.emit('freeze')

    def center(self):
        logger(f'Motor {self.id} centering')
        self.set_position(0)

    def zero(self):
        logger(f'Motor {self.id} zeroing position')
        self.currentPos = 0
        self.goalPos = 0
        self.emit('reset')

    def start_homing(self):
        logger(f'Motor {self.id} starting homing')
        self.emit('homing')
        self.go_home()
