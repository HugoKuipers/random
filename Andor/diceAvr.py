def diceAvarage(dNum=1, dSides=[1,2,3,4,5,6]):
    tempAv = 0
    for i in dSides:
        tempAv += i
    avarage = dNum * (tempAv/len(dSides))
    return avarage

def highestDiceAvarage(dNum=1, dSides=[1,2,3,4,5,6]):
    resultArr = {0:{}}
    for i in dSides:
        resultArr[0][i] = 1
    for i in range(1, dNum):
        resultArr[i] = {}
        for j in resultArr[i-1]:
            for k in dSides:
                num = max(j,k)
                if num not in resultArr[i]:
                    resultArr[i][num] = resultArr[i-1][j]
                else:
                    resultArr[i][num] += resultArr[i-1][j]
    total = 0
    divider = 0
    for d,c in resultArr[dNum-1].items():
        total += d*c
        divider += c
    avarage = total/divider
    return avarage;

def diceAmountToGetHighestAverageOf(num=6, dSides=[1,2,3,4,5,6]):
    if num > 6:
        num = 6
    num -= 0.01
    going = True
    count = 0
    while going:
        count += 1
        if highestDiceAvarage(count, dSides) > num:
            going = False
    return [count, highestDiceAvarage(count, dSides)]

def highestDiceAvarageOneByOne(dNum=1, dSides=[1,2,3,4,5,6]):
    resultArr = {0:{}}
    avArr = {0:3.5}
    for i in dSides:
        resultArr[0][i] = 1
    for i in range(1, dNum):
        resultArr[i] = {}
        for k in dSides:
            num = max(avArr[i-1],k)
            if num not in resultArr[i]:
                resultArr[i][num] = 1
            else:
                resultArr[i][num] += 1
        total = 0
        divider = 0
        for d,c in resultArr[i].items():
            total += d*c
            divider += c
        avArr[i] = total/divider
    avarage = avArr[dNum-1]
    return avarage;

def highestWizardAvg(dNum=1, dSides=[1,2,3,4,5,6]):
    dSides = dSides[len(dSides) // 2:]
    return highestDiceAvarage(dNum, dSides)


def qAndA():
    hero = input("Kies een held: s(strijder) / t(tovenaar) / e(elf) / d(dwerg)")
    dice = int(input("kies aantal dobbelstenen (afhankelijk van wilskracht)"))
    if hero == "t":
        print(highestWizardAvg(dice))
    elif hero == "s" or hero == "d":
        print(highestDiceAvarage(dice))
    elif hero == "e":
        print(highestDiceAvarageOneByOne(dice))
    else:
        print("Kies een van de gegeven input mogelijkheden (s/t/e/d)")
        qAndA()
    return


while True:
    qAndA()
    if input("Doorgaan? (y/n)") == "n": break
