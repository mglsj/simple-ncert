def insertFront(myDeque, element):
    myDeque.insert(0, element)


def getFront(myDeque):
    if not (isEmpty(myDeque)):
        return myDeque[0]
    else:
        print("Queue underflow")
        return myDeque.pop(0)


def main():
    dQu = list()

    choice = int(input("enter 1 to use as normal queue 2 otherwise : "))

    if choice == 1:
        element = input("data for insertion at rear ")
        insertRear(dQu, element)
        element = getFront(dQu)
        print("data at the beginning of queue is ", element)
        element = input("data for insertion at front ")
        insertRear(dQu, element)
        print("data removed from front of queue is ", deletionFront(dQu))
        print("data removed from front of queue is ", deletionFront(dQu))
