from debug import Debug

# Create the logger instance
logger = Debug('mock:test\t')

# Test data
test = [1, 2, 3]

my_object = {
    "name": "Grok",
    "species": "AI",
    "humor_level": 11,
    "rebellious_streak": True
}

foo = 1

# Logging various messages
logger("Hello World")
logger(f"Hello World {foo}")
logger("Hello Array", test)
logger("Hello Object", my_object)

# If you want to run this file as a standalone script
if __name__ == '__main__':
    # Additional test messages can be added here
    logger("Test message 1")
    logger("Test message 2", [4, 5, 6])
    logger("Test message 3", {"key": "value", "number": 42})
