import { defineStore } from 'pinia'

import { TaskStore } from '@/utils/store'
import { MessageType } from '@/api'

export enum CronTaskMode {
  CUSTOM = 'custom',
  NORMAL = 'normal',
  PRESET = 'preset'
}

export interface CronTask {
  uid: string
  mode: CronTaskMode
  type: MessageType
  name: string
  receiver_ids: string[]
  cron: string
  enabled: boolean
  params: any
}

const CronTaskHelper = {
  start: (task: CronTask) => {
    window.ipcRenderer.send('start-cron-task', JSON.stringify(task))
  },
  stop: (task: CronTask) => {
    window.ipcRenderer.send('stop-cron-task', JSON.stringify(task))
  },
  remove: (task: CronTask) => {
    window.ipcRenderer.send('remove-cron-task', JSON.stringify(task))
  }
}

export const useCronTaskStore = defineStore('cron_task', function () {
  const CRON_SAVED_TASKS_KEY = 'cron_tasks'
  const store = new TaskStore<CronTask>(CRON_SAVED_TASKS_KEY)
  const { tasks } = store

  const addTask = (task: CronTask) => {
    CronTaskHelper.start(task)
    store.addTask(task)
  }

  const editTask = (index: number, task: CronTask) => {
    CronTaskHelper.stop(task)
    if (task.enabled) {
      CronTaskHelper.start(task)
    }
    store.editTask(index, task)
  }

  const removeTask = (index: number) => {
    CronTaskHelper.remove(tasks.value[index])
    store.removeTask(index)
  }

  return {
    tasks,
    addTask,
    editTask,
    removeTask
  }
})
