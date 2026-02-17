import { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import Ellipsis from "../../../assets/ellipsis-vertical.svg?react";
import { AnchoredPortal } from "../../../components/portals/AnchoredPortal";
import { dictionary } from "../../../utils/dictionary";
import { useDebounce } from "../../../hooks/useDebounce";
import { FixedPortal } from "../../../components/portals/FixedPortal";
import { FormTextarea } from "../../../components/ui/FormTextarea";

export function Todo({ todo, isLast, onChange, onDelete }) {
    const actionsRef = useRef(null);
    const [ done, setDone ] = useState(todo.done);
    const [ actionClicked, setActionClicked ] = useState(null);
    const debounceDone = useDebounce(done, 500);
    const [ actionsVisible, setActionsVisible ] = useState(false);

    useEffect(() => {
        if (todo.done === debounceDone) return;
        onChange({ done: debounceDone });
    }, [debounceDone]);

    const handleActionClick = (action) => {
        setActionsVisible(false);
        setActionClicked(action);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onChange({
            title: formData.get('title'),
            description: formData.get('description')
        });
        setActionClicked(null);
    };

    const handleDeleteSubmit = () => {
        onDelete();
        setActionClicked(null);
    };

    return <>
        <div className={`bg-bg p-2 flex flex-col gap-2 group/todo ${isLast ? 'border-b-1 border-bg-dark' : ''}`}>
            <div className='flex gap-2 items-center'>
                <input onChange={(e) => setDone(e.target.checked)} checked={done} type="checkbox" id={`todo_${todo._id}`} className='cursor-pointer w-5 h-5 min-w-5' />
                <label htmlFor={`todo_${todo._id}`} className='cursor-pointer flex-1 text-sm md:text-base'>
                    <p className={`${done && 'line-through text-bg-dark'}`}>{todo.title}</p>
                    {todo.description && <p className='text-xs font-bold text-special mt-1'>{todo.description}</p>}
                </label>
                <Button onClick={() => setActionsVisible(true)} className={`${actionsVisible ? 'visible' : 'visible lg:invisible'} group-hover/todo:visible max-w-fit flex-1`}><Ellipsis ref={actionsRef} className='w-6 h-6 fill-white group-hover:fill-special' /></Button>
            </div>
        </div>
        {actionsVisible && <AnchoredPortal anchorRef={actionsRef} onRequestClose={() => setActionsVisible(false)}>
            <ul className="flex flex-col gap-1">
                <li>
                    <button onClick={() => handleActionClick('edit')} className="w-full text-left transition-all px-2 py-1 cursor-pointer rounded-md font-semibold text-main hover:bg-special hover:text-white">{dictionary.checklist_actionEdit.PL}</button>
                </li>
                <li>
                    <button onClick={() => handleActionClick('delete')} className="w-full text-left transition-all px-2 py-1 cursor-pointer rounded-md font-semibold text-main hover:bg-special hover:text-white">{dictionary.checklist_actionDelete.PL}</button>
                </li>
            </ul>
        </AnchoredPortal>}
        {actionClicked && <FixedPortal onRequestClose={() => setActionClicked(null)}>
            {actionClicked === 'edit' && <form onSubmit={(e) => handleEditSubmit(e)} className='flex flex-col gap-4 md:min-w-lg'>
                <FormTextarea name='title' defaultValue={todo.title} label={dictionary.checklist_addTaskNameLabel.PL} id='taskName' />
                <FormTextarea name='description' defaultValue={todo.description} label={dictionary.checklist_addTaskDescriptionLabel.PL} id='taskDescription' />
                <Button>{dictionary.checklist_actionEdit.PL}</Button>
            </form>}
            {actionClicked === 'delete' && <div className='flex flex-col gap-4 md:min-w-lg'>
                <p>{dictionary.checklist_deleteTodoEnsure.PL}</p>
                <div className="flex gap-4">
                    <Button variant='outline' className='flex-1' onClick={() => setActionClicked(null)}>{dictionary.no.PL}</Button>
                    <Button className='flex-1' onClick={handleDeleteSubmit}>{dictionary.yes.PL}</Button>
                </div>
            </div>}
        </FixedPortal>}
    </>
}