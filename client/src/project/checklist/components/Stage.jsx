import { useState } from "react";
import { ExpandableContent } from "../../../components/ui/ExpandableContent"
import { dictionary } from "../../../utils/dictionary"
import { Todo } from "./Todo"
import { CREATE_TODO, DELETE_STAGE, DELETE_TODO, UPDATE_STAGE, UPDATE_TODO } from "../graphql/checklist";
import { useMutation } from "@apollo/client/react";
import { FixedPortal } from "../../../components/portals/FixedPortal";
import { FormTextarea } from "../../../components/ui/FormTextarea";
import Button from "../../../components/ui/Button";
import { useParams } from "react-router-dom";
import { gql } from "@apollo/client";

export function Stage({ stage }) {
    const { id } = useParams();
    const [activePicker, setActivePicker] = useState(null);

    const [createTodo] = useMutation(CREATE_TODO, {
        update(cache, { data }, { variables }) {
            if (!data?.createTodo) return;
            cache.modify({
                id: cache.identify({
                    __typename: 'ChecklistStage',
                    _id: variables.StageId
                }),
                fields: {
                    todos(existingTodos = []) {
                        const newTodo = cache.writeFragment({
                            data: data.createTodo,
                            fragment: gql`
                                fragment NewTodo on ChecklistTodo {
                                    _id
                                    title
                                    description
                                    done
                                }
                            `
                        });
                        return [...existingTodos, newTodo];
                    }
                }
            })
        }
    });

    const [updateTodo, { loading }] = useMutation(UPDATE_TODO, {
        update(cache, { data }) {
            const updatedTodo = data?.updateTodo;
            if (!updatedTodo) return;

            cache.modify({
                id: cache.identify({
                    __typename: 'ChecklistTodo',
                    _id: updatedTodo._id,
                }),
                fields: {
                    done() {
                        return updatedTodo.done;
                    }
                },
            });
        }
    });

    const [updateStage] = useMutation(UPDATE_STAGE, {
        update(cache, { data }) {
            const updatedStage = data?.updateStage;
            if (!updatedStage) return;

            cache.modify({
                id: cache.identify({
                    __typename: 'ChecklistStage',
                    _id: updatedStage._id,
                }),
                fields: {
                    done() {
                        return updatedStage.done;
                    }
                },
            });
        }
    });

    const [deleteTodo] = useMutation(DELETE_TODO, {
        update(cache, { data }) {
            const { _id, stageId } = data?.deleteTodo;
            if (!_id || !stageId) return;


            cache.modify({
                id: cache.identify({
                    __typename: 'ChecklistStage',
                    _id: stageId
                }),
                fields: {
                    todos(existingTodos = [], { readField }) {
                        return existingTodos.filter(t => readField('_id', t) !== _id);
                    }
                }
            });
            cache.evict({
                id: cache.identify({
                    __typename: 'ChecklistTodo',
                    _id: _id,
                })
            });
            cache.gc();
        }
    });

    const [deleteStage] = useMutation(DELETE_STAGE, {
        update(cache, { data }) {
            const { _id } = data?.deleteStage;
            if (!_id) return;


            cache.modify({
                id: cache.identify({
                    __typename: 'Project',
                    _id: id
                }),
                fields: {
                    checklist(existingChecklists = [], { readField }) {
                        return existingChecklists.filter(c => readField('_id', c) !== _id);
                    }
                }
            });
            cache.evict({
                id: cache.identify({
                    __typename: 'ChecklistTodo',
                    _id: _id,
                })
            });
            cache.gc();
        }
    });

    const handleTodoChange = (stageId, todoId, data) => {
        updateTodo({
            variables: {
                ProjectId: id,
                StageId: stageId,
                TodoId: todoId,
                Input: data
            }
        });
    };

    const handleStageChange = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateStage({
            variables: {
                ProjectId: id,
                StageId: stage._id,
                Input: {
                    title: formData.get('title')
                }
            }
        });
        setActivePicker(null);
    };

    const handleTodoDelete = (stageId, todoId) => {
        deleteTodo({
            variables: {
                ProjectId: id,
                StageId: stageId,
                TodoId: todoId
            }
        });
    };

    const handleStageDelete = (stageId) => {
        deleteStage({
            variables: {
                ProjectId: id,
                StageId: stageId,
            }
        });
        setActivePicker(null);
    };

    const handleTodoCreate = (e, stageId) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createTodo({
            variables: {
                ProjectId: id,
                StageId: stageId,
                Input: {
                    title: formData.get('title'),
                    description: formData.get('description')
                }
            }
        });
        setActivePicker(null);
    };

    return <>
        <ExpandableContent title={stage.title} actions={[
            {
                name: dictionary.checklist_actionEdit.PL,
                action: () => setActivePicker('stageEdit')
            },
            {
                name: dictionary.checklist_actionDelete.PL,
                action: () => setActivePicker('stageDelete')
            }
        ]}>
            <div className='flex flex-col rounded-md mb-2 md:mb-4 overflow-hidden'>
                {stage.todos.map((todo, index) => <Todo key={todo._id} onDelete={() => { handleTodoDelete(stage._id, todo._id) }} onChange={(data) => handleTodoChange(stage._id, todo._id, data)} todo={todo} isLast={index < stage.todos.length - 1} />)}
            </div>
            <Button onClick={() => setActivePicker('todo')}><p className='flex items-center gap-2'><span className='text-2xl'>+</span>{dictionary.checklist_addTodo.PL}</p></Button>
        </ExpandableContent>

        {activePicker === 'todo' && <FixedPortal onRequestClose={() => setActivePicker(null)}>
            <form className='flex flex-col gap-4 md:min-w-lg' onSubmit={(e) => handleTodoCreate(e, stage._id)}>
                <FormTextarea name='title' label={dictionary.checklist_addTaskNameLabel.PL} id='taskName' />
                <FormTextarea name='description' label={dictionary.checklist_addTaskDescriptionLabel.PL} id='taskDescription' />
                <Button>{dictionary.add.PL}</Button>
            </form>
        </FixedPortal>}
        {activePicker === 'stageEdit' && <FixedPortal onRequestClose={() => setActivePicker(null)}>
            <form className='flex flex-col gap-4 md:min-w-lg' onSubmit={handleStageChange}>
                <FormTextarea name='title' defaultValue={stage.title} label={dictionary.checklist_addStageLabel.PL} id='title' />
                <Button>{dictionary.edit.PL}</Button>
            </form>
        </FixedPortal>}
        {activePicker === 'stageDelete' && <FixedPortal onRequestClose={() => setActivePicker(null)}>
            <div className='flex flex-col gap-4 md:min-w-lg'>
                <p>{dictionary.checklist_deleteStageEnsure.PL}</p>
                <div className="flex gap-4">
                    <Button variant='outline' className='flex-1' onClick={() => setActivePicker(null)}>{dictionary.no.PL}</Button>
                    <Button className='flex-1' onClick={() => handleStageDelete(stage._id)}>{dictionary.yes.PL}</Button>
                </div>
            </div>
        </FixedPortal>}
    </>
}