# Function to check if a key is present or not
def hashFind(key, hashTable):
    if hashTable[key % 10] == key:  # key is present
        return (key % 10) + 1  # return the position

    else:
        return None  # key is not present


# end of function

# create hashTable with 10 empty positions
print("We have created a hashTable of 10 positions:")
hashTable = [None, None, None, None, None, None, None, None, None, None]
print(hashTable)

L = [34, 16, 2, 93, 80, 77, 51]
print("The given list is", L[::])

# Apply hash function
for i in range(0, len(L)):
    hashTable[L[i] % 10] = L[i]
print("The hash table contents are: ")

for i in range(0, len(hashTable)):
    print("hashindex=", i, " , value =", hashTable[i])

key = int(input("Enter the number to be searched:"))
position = hashFind(key, hashTable)
if position is None:
    print("Number", key, "is not present in the hash table")
else:
    print("Number ", key, " present at ", position, " position")
