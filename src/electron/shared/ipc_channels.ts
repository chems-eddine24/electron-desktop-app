export const IPC = {
    TASKS_GET_ALL: 'tasks:getAll',
    TASKS_CREATE:  'tasks:create',
    TASKS_UPDATE:  'tasks:update',
    TASKS_DELETE:  'tasks:delete',
    PROJECTS_CREATE:  'projects:create',
    PROJECTS_UPDATE:  'projects:update',
    PROJECTS_GET_ALL:  'projects:getAll',
    PROJECTS_DELETE:  'projects:delete',
    PROJECTS_SELECT:  'projects:select',

    TAGS_GET_ALL: 'tags:getAll',
    TAGS_CREATE: 'tags:create',
    TAGS_DELETE: 'tags:delete',
    TAGS_GET_PROJECT: 'tags:getProjectTags',
    TAGS_ADD_TO_PROJECT: 'tags:addToProject',
    TAGS_REMOVE_FROM_PROJECT: 'tags:removeFromProject',
    TAGS_GET_TASK: 'tags:getTaskTags',
    TAGS_ADD_TO_TASK: 'tags:addToTask',
    TAGS_REMOVE_FROM_TASK: 'tags:removeFromTask',

} as const