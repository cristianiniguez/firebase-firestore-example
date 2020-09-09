const db = firebase.firestore()

const taskForm = document.querySelector('#task-form')
const tasksContainer = document.querySelector('#tasks-container')

let editStatus = false
let id = ''

const saveTask = (title, description) => {
  return db.collection('tasks').doc().set({
    title,
    description
  })
}

const getTasks = () => db.collection('tasks').get()

const getTask = id => db.collection('tasks').doc(id).get()

const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback)

const deleteTask = id => db.collection('tasks').doc(id).delete()

const updateTask = (id, udpdatedTask) => db.collection('tasks').doc(id).update(udpdatedTask)

window.addEventListener('DOMContentLoaded', e => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = ''
    querySnapshot.docs.forEach(doc => {
      const task = doc.data()
      task.id = doc.id
      tasksContainer.innerHTML += `
        <div class="card card-body mt-2 border-primary">
          <h4>${task.title}</h4>
          <p>${task.description}</p>
          <div>
            <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
            <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
          </div>
        </div>
      `
    })
    const btnsDelete = document.querySelectorAll('.btn-delete')
    btnsDelete.forEach(btn => {
      btn.addEventListener('click', e => {
        deleteTask(e.target.dataset.id)
          .then(() => {
            console.log('La tarea se eliminó')
          })
      })
    })
    const btnsEdit = document.querySelectorAll('.btn-edit')
    btnsEdit.forEach(btn => {
      btn.addEventListener('click', e => {
        getTask(e.target.dataset.id)
          .then(doc => {
            const task = doc.data()
            taskForm['task-title'].value = task.title
            taskForm['task-description'].value = task.description
            editStatus = true
            id = doc.id
            taskForm['btn-task-form'].innerText = 'Update'
          })
      })
    })
  })
})

taskForm.addEventListener('submit', e => {
  e.preventDefault()
  const title = taskForm['task-title']
  const description = taskForm['task-description']
  if (!editStatus) {
    saveTask(title.value, description.value)
      .then(() => {
        console.log('La tarea se guardó')
        taskForm.reset()
        title.focus()
      })
      .catch(err => {
        console.error(`Ocurrió un error: ${err.message}`)
      })
  } else {
    updateTask(id, {
      title: title.value,
      description: description.value
    })
      .then(() => {
        console.log('La tarea se editó')
        taskForm.reset()
        title.focus()
        editStatus = false
        taskForm['btn-task-form'].innerText = 'Save'
        id = ''
      })
      .catch(err => {
        console.error(`Ocurrió un error: ${err.message}`)
      })
  }
})