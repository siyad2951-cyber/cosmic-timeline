import pygame
import random
import sys
import math

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 600
WINDOW_HEIGHT = 600
CELL_SIZE = 20
GRID_WIDTH = WINDOW_WIDTH // CELL_SIZE
GRID_HEIGHT = WINDOW_HEIGHT // CELL_SIZE

# Colors
BACKGROUND = (30, 30, 30)      # dark gray, clean static background
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (34, 139, 34)          # forest green
DARK_GREEN = (0, 100, 0)
BROWN = (139, 69, 19)
LIGHT_BROWN = (222, 184, 135)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)
ORANGE = (255, 165, 0)
SKIN = (255, 228, 196)         # for eyes

# Directions
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)

# Game settings
INITIAL_SNAKE = [(5, 5), (4, 5), (3, 5)]
INITIAL_DIRECTION = RIGHT
FOOD_VALUE = 1

# Speed levels
SPEEDS = {"Slow": 6, "Medium": 10, "Fast": 15}

# Setup display
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("Snake Game - Enhanced")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)
small_font = pygame.font.Font(None, 24)

def draw_background():
    """Fill the screen with a clean, static background color."""
    screen.fill(BACKGROUND)

def draw_snake_head(pos, direction):
    """Draw the snake head with eyes facing direction."""
    x, y = pos[0]*CELL_SIZE, pos[1]*CELL_SIZE
    center_x = x + CELL_SIZE//2
    center_y = y + CELL_SIZE//2

    # Head base (circle)
    pygame.draw.circle(screen, GREEN, (center_x, center_y), CELL_SIZE//2 - 1)
    pygame.draw.circle(screen, BLACK, (center_x, center_y), CELL_SIZE//2 - 1, 1)

    # Eyes (two white circles with black pupils)
    eye_offset = CELL_SIZE//6
    pupil_offset = CELL_SIZE//12

    if direction == RIGHT:
        left_eye = (center_x + eye_offset, center_y - eye_offset)
        right_eye = (center_x + eye_offset, center_y + eye_offset)
    elif direction == LEFT:
        left_eye = (center_x - eye_offset, center_y - eye_offset)
        right_eye = (center_x - eye_offset, center_y + eye_offset)
    elif direction == UP:
        left_eye = (center_x - eye_offset, center_y - eye_offset)
        right_eye = (center_x + eye_offset, center_y - eye_offset)
    else:  # DOWN
        left_eye = (center_x - eye_offset, center_y + eye_offset)
        right_eye = (center_x + eye_offset, center_y + eye_offset)

    # Draw eyes
    for eye in (left_eye, right_eye):
        pygame.draw.circle(screen, WHITE, eye, CELL_SIZE//8)
        pygame.draw.circle(screen, BLACK, eye, CELL_SIZE//16)

def draw_snake_body(pos, index):
    """Draw a snake body segment with scale pattern."""
    x, y = pos[0]*CELL_SIZE, pos[1]*CELL_SIZE
    center_x = x + CELL_SIZE//2
    center_y = y + CELL_SIZE//2

    # Body base
    pygame.draw.circle(screen, GREEN, (center_x, center_y), CELL_SIZE//2 - 2)
    pygame.draw.circle(screen, DARK_GREEN, (center_x, center_y), CELL_SIZE//2 - 2, 1)

    # Scales (small arcs/dots)
    for dx in (-3, 0, 3):
        for dy in (-3, 0, 3):
            if dx == 0 and dy == 0:
                continue
            scale_x = center_x + dx
            scale_y = center_y + dy
            pygame.draw.circle(screen, DARK_GREEN, (scale_x, scale_y), 2)

def draw_food(pos):
    """Draw an apple as food."""
    x, y = pos[0]*CELL_SIZE, pos[1]*CELL_SIZE
    center_x = x + CELL_SIZE//2
    center_y = y + CELL_SIZE//2

    # Apple body
    pygame.draw.circle(screen, RED, (center_x, center_y), CELL_SIZE//2 - 1)
    pygame.draw.circle(screen, BLACK, (center_x, center_y), CELL_SIZE//2 - 1, 1)

    # Leaf
    leaf_points = [
        (center_x + 2, center_y - CELL_SIZE//3),
        (center_x + 8, center_y - CELL_SIZE//3 - 4),
        (center_x + 4, center_y - CELL_SIZE//3 - 8)
    ]
    pygame.draw.polygon(screen, GREEN, leaf_points)

    # Stem
    pygame.draw.line(screen, BROWN,
                     (center_x, center_y - CELL_SIZE//3),
                     (center_x, center_y - CELL_SIZE//3 - 6), 2)

def draw_snake(snake, direction):
    """Draw the entire snake."""
    for i, segment in enumerate(snake):
        if i == 0:
            draw_snake_head(segment, direction)
        else:
            draw_snake_body(segment, i)

def get_random_empty_cell(snake):
    while True:
        x = random.randint(0, GRID_WIDTH - 1)
        y = random.randint(0, GRID_HEIGHT - 1)
        if (x, y) not in snake:
            return (x, y)

def check_collision(snake):
    head = snake[0]
    if head[0] < 0 or head[0] >= GRID_WIDTH or head[1] < 0 or head[1] >= GRID_HEIGHT:
        return True
    if head in snake[1:]:
        return True
    return False

def show_start_screen():
    """Display start menu with speed selection."""
    selected = "Medium"
    options = ["Slow", "Medium", "Fast"]
    index = 1

    while True:
        screen.fill(BACKGROUND)
        title = font.render("SNAKE GAME", True, WHITE)
        screen.blit(title, (WINDOW_WIDTH//2 - title.get_width()//2, 150))

        prompt = small_font.render("Select Speed (Left/Right arrows)", True, WHITE)
        screen.blit(prompt, (WINDOW_WIDTH//2 - prompt.get_width()//2, 250))

        # Draw options
        for i, opt in enumerate(options):
            color = YELLOW if i == index else WHITE
            text = font.render(opt, True, color)
            x = WINDOW_WIDTH//2 - text.get_width()//2 + (i-1)*100
            screen.blit(text, (x, 300))

        instruction = small_font.render("Press ENTER to start", True, WHITE)
        screen.blit(instruction, (WINDOW_WIDTH//2 - instruction.get_width()//2, 400))

        pygame.display.flip()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    index = (index - 1) % len(options)
                elif event.key == pygame.K_RIGHT:
                    index = (index + 1) % len(options)
                elif event.key == pygame.K_RETURN:
                    return options[index]

def show_game_over(score):
    screen.fill(BACKGROUND)
    game_over_text = font.render("GAME OVER", True, RED)
    score_text = font.render(f"Score: {score}", True, WHITE)
    restart_text = small_font.render("Press R to restart or Q to quit", True, WHITE)

    screen.blit(game_over_text, (WINDOW_WIDTH//2 - game_over_text.get_width()//2, WINDOW_HEIGHT//2 - 60))
    screen.blit(score_text, (WINDOW_WIDTH//2 - score_text.get_width()//2, WINDOW_HEIGHT//2 - 20))
    screen.blit(restart_text, (WINDOW_WIDTH//2 - restart_text.get_width()//2, WINDOW_HEIGHT//2 + 20))
    pygame.display.flip()

    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_r:
                    waiting = False
                if event.key == pygame.K_q:
                    pygame.quit()
                    sys.exit()

def main():
    while True:
        speed_choice = show_start_screen()
        base_speed = SPEEDS[speed_choice]

        snake = INITIAL_SNAKE[:]
        direction = INITIAL_DIRECTION
        food = get_random_empty_cell(snake)
        score = 0
        level = 1
        running = True

        while running:
            # Event handling
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_UP and direction != DOWN:
                        direction = UP
                    elif event.key == pygame.K_DOWN and direction != UP:
                        direction = DOWN
                    elif event.key == pygame.K_LEFT and direction != RIGHT:
                        direction = LEFT
                    elif event.key == pygame.K_RIGHT and direction != LEFT:
                        direction = RIGHT

            # Move snake
            head = snake[0]
            new_head = (head[0] + direction[0], head[1] + direction[1])
            snake.insert(0, new_head)

            if new_head == food:
                score += FOOD_VALUE
                # Level up every 5 points
                if score % 5 == 0:
                    level += 1
                food = get_random_empty_cell(snake)
            else:
                snake.pop()

            # Collision check
            if check_collision(snake):
                show_game_over(score)
                break  # break inner loop to restart from start screen

            # Drawing
            draw_background()
            draw_snake(snake, direction)
            draw_food(food)

            # UI overlay (score and level)
            score_surface = font.render(f"Score: {score}", True, WHITE)
            level_surface = font.render(f"Level: {level}", True, WHITE)
            screen.blit(score_surface, (10, 10))
            screen.blit(level_surface, (WINDOW_WIDTH - 120, 10))

            pygame.display.flip()

            # Dynamic speed based on level
            current_speed = base_speed + (level - 1) * 2
            clock.tick(current_speed)

if __name__ == "__main__":
    main()