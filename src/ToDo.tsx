import './ToDoPage.css'
import plus from './plus.svg'
import Loader from './Loader';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Chore, ChoresActions, getUserChoreList, updateUserChoreList } from './dbConnection';


const ChoreItem = ({ description, isDone, id, isNewItem, checked, onItemClicked, addNewItem, onKeyDown, updateDescription }: Chore & ChoresActions) => {
    if (isDone) {
        return null;
    }
    if (isNewItem) {
        return <input className='addChoreInput' type='text' onChange={(e) => updateDescription(e, id)} onKeyDown={(e) => onKeyDown(e, id)} onBlur={() => addNewItem(id)} autoFocus />

    }
    return <div className='Chore' onClick={() => onItemClicked(id)}>
        <input type='checkbox' checked={checked} />
        {checked ? <del>{description}</del> : <span>{description}</span>}
    </div>
};

export const ToDo: FC = () => {
    const [userChoreList, setUserChoreList] = useState<Chore[]>([]);
    const [selectedItems, setSelectedItems] = useState(new Set<string>());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loaderText, setLoaderText] = useState<string>('Fetching your list...')

    useEffect(() => {
        async function getList() {
            try {
                setIsLoading(true);
                const list = await getUserChoreList('shahar');
                if (!list.length) {
                    return;
                }
                setUserChoreList(list);
            } catch (err) {
                alert(err);
            }
            finally {
                setIsLoading(false);
                setLoaderText('Fetching your list...');
            }
        }
        getList();
    }, [])

    const updateUserList = useCallback(async (updatedList?: Chore[]) => {
        try {
            setIsLoading(true);
            await updateUserChoreList(updatedList || userChoreList);
            selectedItems.clear()
            setSelectedItems(selectedItems);
        } catch (err) {
            alert(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedItems, userChoreList])

    const addNewChoreToList = async (itemId: string) => {
        setLoaderText('Updating your list...');
        const choreIndex = userChoreList.findIndex(item => item.id === itemId)
        const chore = userChoreList[choreIndex];

        if (chore.description === '') {
            userChoreList.splice(choreIndex, 1);
            setUserChoreList(userChoreList);
            await updateUserList();
            return;
        }

        chore.isNewItem = false;
        userChoreList[choreIndex] = chore;
        setUserChoreList(userChoreList);
        await updateUserList();
    }

    const handleEnterKeyPressed = async (e: any, itemId: string) => {
        if (e.key !== 'Enter') {
            return;
        }
        await addNewChoreToList(itemId);
    }

    const updateChoreDescription = (e: any, itemId: string) => {
        if (e.key === 'Enter') {
            return;
        }
        const choreIndex = userChoreList.findIndex(item => item?.id === itemId)
        if (choreIndex === -1) {
            return;
        }
        const chore = userChoreList[choreIndex]
        chore.description = e.target.value;
        setUserChoreList(userChoreList);
    }

    const addNewChore = () => {
        const newChore: Chore = {
            id: JSON.stringify(Date.now()),
            description: '',
            isNewItem: true,
            isDone: false,
        }
        setUserChoreList([...userChoreList, newChore]);
    }

    const onItemsClear = useCallback(async (e: any) => {
        setIsLoading(true);
        setLoaderText('Deleting items...')
        if (!selectedItems.size) {
            return;
        }
        const updatedList = userChoreList.map(chore => {
            if (selectedItems.has(chore.id)) {
                chore.isDone = !chore.isDone;
            }
            return chore;
        })
        await updateUserList(updatedList);
    }, [selectedItems, updateUserList, userChoreList])

    const onItemChecked = (itemId: string) => {
        changeItemCheckState(itemId);
        const isItemChecked = selectedItems.has(itemId);
        if (!isItemChecked) {
            setSelectedItems(previousSet => new Set(previousSet.add(itemId)));
            return;
        }
        selectedItems.delete(itemId);
        setSelectedItems(new Set(selectedItems));
    };

    const changeItemCheckState = (itemId: string) => {
        const item = userChoreList.find(item => item.id === itemId)!;
        item.checked = !item.checked;
        setUserChoreList(userChoreList);
    }

    const isCleanDisabled = useMemo(() => {
        return selectedItems.size === 0;
    }, [selectedItems.size])


    return <div className='ToDoApp'>
        <div className='Modal'>
            <span className='title'>ToDo list</span>
            <div className='Chores'>
                {isLoading ? <Loader text={loaderText}/> : userChoreList.map(chore => <ChoreItem description={chore.description}
                    id={chore.id}
                    isNewItem={chore.isNewItem}
                    isDone={chore.isDone}
                    checked={chore.checked}
                    onItemClicked={onItemChecked}
                    onKeyDown={handleEnterKeyPressed}
                    addNewItem={addNewChoreToList}
                    updateDescription={updateChoreDescription}
                />)}
            </div>
            <button className='cleanButton' onClick={onItemsClear} disabled={isCleanDisabled}>Clean list ({selectedItems.size} items)</button>
            <button className='addButton' onClick={addNewChore}><img src={plus} className='plusImg' alt=''></img></button>
        </div>
    </div>
};