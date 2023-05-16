import {createBrowserRouter} from 'react-router-dom';
import DefaultLayout from './Layout/DefaultLayout';
import CreateUpdateProject from './components/DashboardProject/components/CreateProject/createUpdateProject';
import DetailProject from './components/DashboardProject/components/Detail';
import ProjectManager from './components/DashboardProject/components/List';
import TaskInProject from './components/DashboardProject/components/Task';
import EditTask from './components/DashboardProject/components/Task/editTask';
import AllListTask from './components/ListTask/components';
import TaskManagerPage from './components/TaskManager';
const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <TaskManagerPage />,
            },

            {
                path: '/project',
                element: <ProjectManager />,
            },
            {
                path: '/project/:id',
                element: <DetailProject />,
            },
            {
                path: '/project/:id/tasks',
                element: <TaskInProject />,
            },
            {
                path: '/project/:id/list-task',
                element: <AllListTask />,
            },
            {
                path: '/project/:id/tasks/:taskId',
                element: <EditTask />,
            },
            {
                path: '/project/create',
                element: <CreateUpdateProject />,
            },
        ],
    },
]);

export default router;
