from cx_Freeze import setup, Executable

base = None

executables = [Executable("diceAvr.py", base=base)]

packages = ["idna"]
options = {
    'build_exe': {
        'packages':packages,
    },
}

setup(
    name = "Andor dobbel kansen",
    options = options,
    version = "0.1",
    description = 'Dobbel kansen voor elke held in legenden van Andor, geeft gemiddelde terug.',
    executables = executables
)
