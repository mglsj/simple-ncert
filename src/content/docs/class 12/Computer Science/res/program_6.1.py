# function to perform the search
def linearSearch(list, key):
    for index in range(0, len(list)):
        if list[index] == key:  # key is present
            return index + 1  # position of key in list
    return None  # key is not in list


# end of function

list1 = []  # Create an empty list
maximum = int(input("How many elements in your list? "))

print("Enter each element and press enter: ")
for i in range(0, maximum):
    n = int(input())
    list1.append(n)  # append elements to the list

print("The List contents are:", list1)

key = int(input("Enter the number to be searched:"))
position = linearSearch(list1, key)

if position is None:
    print("Number", key, "is not present in the list")
else:
    print("Number", key, "is present at position", position)
