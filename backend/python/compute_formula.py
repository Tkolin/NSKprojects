# compute_formula.py
import sys
from sympy import solve, Eq, symbols

# Получение уравнения из аргументов командной строки
equation = sys.argv[1]

# Разбиение уравнения на левую и правую части
left, right = equation.split('=')

# Парсинг уравнения
x = symbols('x')
eq = Eq(eval(left), eval(right))

# Решение уравнения
solution = solve(eq, x)

# Вывод решения
print(solution[0])
