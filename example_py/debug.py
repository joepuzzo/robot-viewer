import re
import os

def select_color(namespace, colors):
    hash_value = 0

    for char in namespace:
        hash_value = (hash_value << 5) - hash_value + ord(char)
        hash_value |= 0  # Convert to 32bit integer

    return colors[abs(hash_value) % len(colors)]

def format_args(args, config):
    name = config['namespace']
    if config['use_colors']:
        color_code = f'\033[3{config["color"]};1m'
        prefix = f'  {color_code}{name} \033[0m'
        args_list = list(args)
        args_list[0] = prefix + str(args_list[0]).replace('\n', f'\n{prefix}')
        return tuple(args_list)
    else:
        args_list = list(args)
        args_list[0] = f'{name} {args_list[0]}'
        return tuple(args_list)

def create_logger(prefix=None, config=None):
    def logger(*args):
        if prefix:
            args = (prefix, *args)

        matches = [re.compile('^' + ns[:-1] + '.*$' if ns.endswith('*') else '^' + ns + '$') 
                   for ns in config['namespaces'].split(',')]

        match = any(regex.match(prefix) for regex in matches)

        conf = {
            'color': select_color(prefix, config['colors']),
            'namespace': prefix,
            'use_colors': config['use_colors'],
        }

        if os.getenv('NODE_ENV') != 'production' and match:
            args = format_args(args, conf)
            print(*args)

    return logger

def load_config():
    namespaces = os.getenv('DEBUG', '')
    colors = [1, 2, 3, 4, 5, 6]
    use_colors = True

    return {
        'namespaces': namespaces,
        'colors': colors,
        'use_colors': use_colors,
        'format_args': format_args,
    }

def Debug(prefix):
    return create_logger(prefix, load_config())