import json
import sqlite3
conn = sqlite3.connect('UsedCar.db')
c = conn.cursor()
recommend_list1 = []
recommend_list2 = []
luxuryBrand_List = ["BMW", "Audi", "Mercedes-", "Infiniti", "Acura", "Tesla",
"Jaguar", "Land", "Lexus" , "Volvo", "Porsche", "Lincoln", "Genesis", "Cadillac", "Alfa", "Mini"]

def compare1(car1, car2):
    car1Mile = car1[4].replace(",", "")
    car1Mile = car1Mile.replace(" km", "")
    car2Mile = car2[4].replace(",", "")
    car2Mile = car2Mile.replace(" km", "")
    car1Price = car1[6].replace(",", "")
    car2Price = car2[6].replace(",", "")
    mileDiff = int(car1Mile) - int(car2Mile)
    yearDiff = int(car1[3]) - int(car2[3])
    priceDiff = int(car1Price) - int(car2Price)
    mileAndYearDiff = mileDiff - 6000 * yearDiff
    priceDiff += mileAndYearDiff*0.15
    if (car1[5] != car2[5]):
        if(car1[5] == "AWD" and car2[5]!= "AWD"):
            priceDiff = priceDiff - (5000 * (1 - ((2020 - (int(car1[3]))) * 0.1)))
        elif(car1[5] != "AWD" and car2[5]== "AWD"):
            priceDiff = priceDiff + (5000 * (1 - ((2020 - (int(car2[3]))) * 0.1)))
    return priceDiff

def compare2(car1, car2):
    car1Mile = car1[4].replace(",", "")
    car1Mile = car1Mile.replace(" km", "")
    car2Mile = car2[4].replace(",", "")
    car2Mile = car2Mile.replace(" km", "")
    car1Price = car1[6].replace(",", "")
    car2Price = car2[6].replace(",", "")
    mileDiff = int(car1Mile) - int(car2Mile)
    yearDiff = int(car1[3]) - int(car2[3])
    priceDiff = int(car1Price) - int(car2Price)
    mileAndYearDiff = mileDiff - 8000 * yearDiff
    priceDiff += mileAndYearDiff*0.25
    if (car1[5] != car2[5]):
        if(car1[5] == "AWD" and car2[5]!= "AWD"):
            priceDiff = priceDiff - (6000 * (1 - ((2020 - (int(car1[3]))) * 0.1)))
        elif(car1[5] != "AWD" and car2[5]== "AWD"):
            priceDiff = priceDiff + (6000 * (1 - ((2020 - (int(car2[3]))) * 0.1)))
    return priceDiff

def addCar1(car):
    if (len(recommend_list1) < 3):
        recommend_list1.append(car)
        for x in range(len(recommend_list1),0,-1):
            if (x-2 >= 0):
                compare = compare1(recommend_list1[x-1],recommend_list1[x-2])
                if (compare < 0):
                    temp = recommend_list1[x-1]
                    recommend_list1[x-1] = recommend_list1[x-2]
                    recommend_list1[x-2] = temp

    else:
        for x in range(2,-1,-1):
            compare = compare1(car,recommend_list1[x])
            if (compare < 0):
                temp = recommend_list1[x]
                recommend_list1[x] = car
                if(x < 2):
                    recommend_list1[x+1] = temp
            else:
                break


def addCar2(car):
    if (len(recommend_list2) < 3):
        recommend_list2.append(car)
        for x in range(len(recommend_list2),0,-1):
            if (x-2 >= 0):
                compare = compare2(recommend_list2[x-1],recommend_list2[x-2])
                if (compare < 0):
                    temp = recommend_list2[x-1]
                    recommend_list2[x-1] = recommend_list2[x-2]
                    recommend_list2[x-2] = temp

    else:
        for x in range(2,-1,-1):
            compare = compare2(car,recommend_list2[x])
            if (compare < 0):
                temp = recommend_list2[x]
                recommend_list2[x] = car
                if(x < 2):
                    recommend_list2[x+1] = temp
            else:
                break

def main():
    for row in c.execute('SELECT * FROM CarInfo ORDER BY price'):
        if (row[1] in luxuryBrand_List):
            addCar2(row)
        else:
            addCar1(row)
    # c.execute('DROP table CarInfo')

main()


# print(recommend_list1)
# print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
# print(recommend_list2)


keys = (
    'name',
    'make',
    'model',
    'year',
    'km',
    'drivetrain',
    'price',
)
luxury_list = [dict(zip(keys,t)) for t in recommend_list2]
compact_list = [dict(zip(keys,t)) for t in recommend_list1]
# print(luxury_list)
# print(json.dumps(luxury_list, indent=4))
# print(json.dumps(compact_list, indent=4))
data = dict()
data['luxury'] = luxury_list
data['compact'] = compact_list
print(json.dumps(data))
# print(json.dumps(data, indent=4))
