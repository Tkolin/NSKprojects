# compute_formula.py
import sys
from sympy import solve, Eq, symbols

# Получение уравнений из аргументов командной строки
equations = sys.argv[1:]

# Парсинг уравнений
x = symbols('x')
solutions = []
for equation in equations:
    left, right = equation.split('=')
    eq = Eq(eval(left), eval(right))
    solution = solve(eq, x)
    solutions.append(solution[0])

# Вывод решений
print(solutions)
