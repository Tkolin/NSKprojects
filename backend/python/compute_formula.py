import sys
from sympy import solve, Eq, symbols

equations = sys.argv[1].split(',')

results = []
for equation in equations:
    left, right = equation.split('=')
    _ = symbols('_')
    eq_left = Eq(eval(left), _)
    eq_right = Eq(eval(right), _)
    solution_left = solve(eq_left, _)
    solution_right = solve(eq_right, _)
    if solution_left:
        results.append(str(solution_left[0]))
    elif solution_right:
        results.append(str(solution_right[0]))
    else:
        results.append("No solution found")

print(','.join(results))
