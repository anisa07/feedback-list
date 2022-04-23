
const urlApi = 'http://localhost:3001'

export const getFeedbacks = () => fetch(`${urlApi}/feedbacks`);

export const getRoadmaps = () => fetch(`${urlApi}/roadmaps`);

export const getFilters = () => fetch(`${urlApi}/filters`);

export const getComments = () => fetch(`${urlApi}/comments`);

export const getUsers = () => fetch(`${urlApi}/users`);
