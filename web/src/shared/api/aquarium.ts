import type { Aquarium, CreateAquariumDto, UpdateAquariumDto } from '../types'
import { apiRequest } from './client'

export const aquariumApi = {
  findAll: async (): Promise<Aquarium[]> => {
    return apiRequest<Aquarium[]>('/aquariums')
  },

  findOne: async (id: number): Promise<Aquarium> => {
    return apiRequest<Aquarium>(`/aquariums/${id}`)
  },

  create: async (data: CreateAquariumDto): Promise<Aquarium> => {
    return apiRequest<Aquarium>('/aquariums', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (data: UpdateAquariumDto): Promise<Aquarium> => {
    const { id, ...updateData } = data
    return apiRequest<Aquarium>(`/aquariums/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    })
  },

  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/aquariums/${id}`, {
      method: 'DELETE',
    })
  },
}
