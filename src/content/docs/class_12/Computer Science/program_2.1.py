fobject = open("testfile.txt", "w")  # creating a data file
sentence = input("Enter the contents to be written in the file: ")
fobject.write(sentence)  # Writing data to the file
fobject.close()  # Closing a file
print("Now reading the contents of the file: ")
fobject = open("testfile.txt", "r")
# looping over the file object to read the file
for str in fobject:
    print(str)
fobject.close()
