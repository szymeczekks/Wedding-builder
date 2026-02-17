import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECT } from "../../shared/graphql/project";
import { HeartWave } from "../../../components/ui/HeartWave";
import { useMemo } from "react";
import { dictionary } from "../../../utils/dictionary";

const getChecklistStats = (checklist) => {
    const stats = checklist.reduce((acc, current) => {
        for (const todo of current.todos) {
            acc.total += 1;
            todo.done ? (acc.done += 1) : (acc.inProgress += 1);
            
        }

        return acc;
    }, {
        total: 0,
        done: 0,
        inProgress: 0
    });

    return {
        ...stats,
        progress: Math.round((stats.done / stats.total) * 100)
    }
};

export function SummaryChecklist() {
    let { id } = useParams();

    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });
    const checklistStages = data.getProject.checklist;
    const stats = useMemo(() => {
        return getChecklistStats(checklistStages);
    }, [checklistStages]);

    return <div className="flex flex-col gap-6 justify-center items-center">
        <div className='sticky top-0'>
            <h4 className="font-semibold text-lg md:text-2xl font-header text-center mt-4">{dictionary.checklist_progressHeader.PL}:</h4>
            <HeartWave type='dark' progress={stats.progress}/>
        </div>
        <div className="flex-1 flex flex-wrap justify-center gap-2 md:gap-4">
            <p className="text-base md:text-lg">{dictionary.numberOfTasks.PL}: <span className="text-lg md:text-xl font-bold">{stats.total}</span></p>
            <p className="text-base md:text-lg">{dictionary.numberOfTasksDone.PL}: <span className="text-lg md:text-xl font-bold">{stats.done}</span></p>
            <p className="text-base md:text-lg">{dictionary.numberOfTasksInProgress.PL}: <span className="text-lg md:text-xl font-bold">{stats.inProgress}</span></p>
        </div>
    </div>
}