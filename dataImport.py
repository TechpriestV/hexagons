# Author: Viktor Ceder

import csv, sys, json
def startup():
    makeJson = False
    files = []
    # print(sys.argv)
    if len(sys.argv) >= 2:
        #filename = sys.argv[1]
        for i in sys.argv[1:]:
            files.append(i)
        if files[-1] == "json":
            makeJson = True
            files.pop(-1)
    else:
        print("Invalid amount of arguments")
        sys.exit()
    return makeJson, files

def getOneWave(filename):
    data = {}
    countries = []
    # print("Filename: " + filename)
    try:
        nextRow = False
        with open(filename) as csvfile:
            reader = csv.reader(csvfile, delimiter=';')
            for row in reader:
                if len(row[-1]) != 0:
                    if len(row[0]) == 0:
                        for item in row[2:]:
                            countries.append(item)
                            data[item] = {question:{wave:[]}}
                    else:
                        row = row[2:]
                        # print(row)
                        for i in range(len(row)):
                            # print(countries[i])
                            row[i] = row[i].replace(',', '.')
                            data[countries[i]][question][wave].append(row[i])

                if nextRow:
                    # print(row)
                    question = row[1]
                    nextRow = False

                if "World" in row[1].split():
                    wave = ' '.join(row[1].split()[3:5]).strip(':')
                    nextRow = True

                
            # print(data)
    except FileNotFoundError: print("No file found with the name: " + filename)
    except: print("Invalid file, make sure it's a csv file with columns seperated by ';' and remove odd charachters")


    return data
# print(len(countries))

def combine(data):
    # get the most countries
    combined = {}
    countries = []
    for i in data:
        for country in i.keys():
            if country not in countries:
                countries.append(country)
    #print(len(countries))
    for country in countries:
        combined[country] = []
        for i in data:
            if country in i:
                #if len(combined[country]) > 0:
                #    print(i[country].keys() in combined[country][0])

                combined[country].append(i[country])
                #print(combined[country][0].keys())
    #print (combined)
    return combined





def make(makeJson, data):
    if makeJson:
        # for country in data.keys():
            # data[country][-1] = int(float(data[country][-1])*1000)
        f = open('religion.json', 'w')
        f.write(json.dumps(data, sort_keys=True, indent=2))
    else:
        data = sorted(data.items())
        for country in data:
            country[1][-1] = int(float(country[1][-1])*1000)

        for country in data:
            print (country[1][-1],end=';')
            for i in country[1][:-1]:
                print(i, end=';')
            print()


if __name__ == '__main__':
    makeJson, files = startup()
    # print(files)
    data = []
    for name in files:

        data.append(getOneWave(name))
    #print(data)
    combined = combine(data)
    make(makeJson, combined)
