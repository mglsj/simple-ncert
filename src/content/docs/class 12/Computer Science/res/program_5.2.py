def selection_Sort(list2):
    flag = 0  # to decide when to swap
    n = len(list2)
    for i in range(n):  # Traverse through all list elements
        min = i
        for j in range(i + 1, len(list2)):
            # the left elements are already sorted in previous passes
            if list2[j] < list2[min]:
                # element at j is smaller than the current min element
                min = j
                flag = 1
        if flag == 1:  # next smallest element is found
            list2[min], list2[i] = list2[i], list2[min]


numList = [8, 7, 13, 1, -9, 4]
selection_Sort(numList)
print("The sorted list is :")
for i in range(len(numList)):
    print(numList[i], end=" ")
