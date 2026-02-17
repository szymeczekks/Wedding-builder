import BrideAndGroomImage from '../../assets/bride-and-groom.png';
import { SectionHeader } from "../../components/ui/SectionHeader";
import { dictionary } from "../../utils/dictionary";
import { HeartWave } from '../../components/ui/HeartWave';
import { useMemo, useState } from 'react';
import { FixedPortal } from '../../components/portals/FixedPortal';
import Button from "../../components/ui/Button";
import { FormInput } from '../../components/ui/FormInput';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_PROJECT } from '../shared/graphql/project';
import { Stage } from './components/Stage';
import { CREATE_STAGE } from './graphql/checklist';
import { gql } from '@apollo/client';


const getChecklistStats = (checklist) => {
    const stats = checklist.reduce((acc, current) => {
        for (const todo of current.todos) {
            acc.total += 1;
            todo.done && (acc.done += 1);
        }

        return acc;
    }, {
        total: 0,
        done: 0
    });

    return {
        ...stats,
        progress: Math.round((stats.done / stats.total) * 100)
    }
};

export function Checklist() {
    const { id } = useParams();
    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });
    const [activePicker, setActivePicker] = useState(null);
    const checklistStages = data.getProject.checklist;
    const stats = useMemo(() => {
        return getChecklistStats(checklistStages);
    }, [checklistStages]);

    const [createStage] = useMutation(CREATE_STAGE, {
        update(cache, { data: { createStage } }) {
            cache.modify({
                id: cache.identify({
                    __typename: 'Project',
                    _id: id
                }),
                fields: {
                    checklist(existingStages = []) {
                        const newStage = cache.writeFragment({
                            data: createStage,
                            fragment: gql`
                                fragment NewStage on Stage {
                                    _id
                                    title
                                    todos {
                                        _id
                                        title
                                        description
                                        done
                                    }
                                }
                            `
                        });

                        return [...existingStages, newStage];
                    }
                }
            })
        }
    });

    const handleStageCreate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createStage({
            variables: {
                ProjectId: id,
                Title: formData.get('title')
            }
        });
        setActivePicker(null);
    };

    return <>
        <SectionHeader header={dictionary.checklist_header.PL} subheader={dictionary.checklist_subheader.PL} image={BrideAndGroomImage} />
        <div className='flex gap-4 items-center lg:items-start flex-col lg:flex-row'>
            <div className='flex flex-1 flex-col gap-2 mt-2'>
                {checklistStages.map(stage => <Stage key={stage._id} stage={stage} />)}
                <Button onClick={() => setActivePicker('stage')}><p className='flex items-center justify-center gap-2'><span className='text-2xl'>+</span>{dictionary.checklist_addStage.PL}</p></Button>
            </div>
            <div className='sticky top-0'>
                <h4 className="font-semibold text-lg md:text-2xl font-header text-center mt-4">{dictionary.checklist_progressHeader.PL}:</h4>
                <HeartWave progress={stats.progress}/>
            </div>
        </div>
        {activePicker === 'stage' && <FixedPortal onRequestClose={() => setActivePicker(null)}>
            <form onSubmit={handleStageCreate} className='flex flex-col gap-4'>
                <FormInput name='title' label={dictionary.checklist_addStageLabel.PL} id='title' />
                <Button>{dictionary.add.PL}</Button>
            </form>
        </FixedPortal>}
    </>
}