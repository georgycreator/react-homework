import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useDeleteTaskMutation, useGetTaskQuery, useUpdateTaskMutation } from '../services/tasksApi'
import { getApiErrorMessage } from '../app/hooks'
import { StatusBadge } from '../components/StatusBadge'
import { ErrorState, LoadingState } from '../components/LoadingState'

const STATUSES = [
  { value: 'todo', label: 'К выполнению' },
  { value: 'doing', label: 'В работе' },
  { value: 'done', label: 'Готово' },
]

export default function TaskPage() {
  const { taskId } = useParams()
  const { currentData: task, isLoading, isFetching, isError, error, refetch } = useGetTaskQuery(taskId)

  if (isLoading || (isFetching && !task)) return <LoadingState>Загружаем задачу…</LoadingState>
  if (isError && error?.status === 404) {
    return (
      <div className="not-found-panel">
        <span className="eyebrow">404 · ЗАДАЧА НЕ НАЙДЕНА</span>
        <h1>Такой задачи нет</h1>
        <p>Возможно, её удалили или ссылка устарела.</p>
        <Link to="/users" className="button button-primary">К участникам</Link>
      </div>
    )
  }
  if (isError && !task) {
    return <ErrorState message={getApiErrorMessage(error)} onRetry={refetch} />
  }
  if (!task) return <LoadingState />

  return (
    <TaskEditor
      key={task.id}
      task={task}
      queryError={isError ? error : null}
      isRefreshing={isFetching}
      onRefresh={refetch}
    />
  )
}

function TaskEditor({ task, queryError, isRefreshing, onRefresh }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState(task.title)
  const [status, setStatus] = useState(task.status)
  const [message, setMessage] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [updateTask, { isLoading: isSaving, error: saveError }] = useUpdateTaskMutation()
  const [deleteTask, { isLoading: isDeleting, error: deleteError }] = useDeleteTaskMutation()


  async function handleSave(event) {
    event.preventDefault()
    if (isSaving || isDeleting) return
    const normalizedTitle = title.trim()
    if (!normalizedTitle) {
      setMessage('Название задачи не может быть пустым.')
      return
    }
    setMessage('')
    try {
      await updateTask({ id: task.id, title: normalizedTitle, status }).unwrap()
      setTitle(normalizedTitle)
      setMessage('Изменения сохранены.')
    } catch {
      // При ошибке оставляем введённые значения в форме.
    }
  }

  async function handleDelete() {
    if (isDeleting || isSaving) return
    try {
      await deleteTask(task.id).unwrap()
      navigate(`/users/${task.userId}/tasks`)
    } catch {
      // При ошибке остаёмся на странице и показываем сообщение API.
    }
  }

  return (
    <section className="task-detail-page">
      <div className="breadcrumbs"><Link to="/users">Участники</Link><span>/</span><Link to={`/users/${task.userId}/tasks`}>Задачи участника</Link><span>/</span><span>Задача</span></div>
      <div className="task-detail-header">
        <div>
          <p className="eyebrow">РЕДАКТИРОВАНИЕ · ID {task.id}</p>
          <h1>Карточка задачи</h1>
          <p className="page-description">Изменения отправляются на сервер и обновляют связанные списки.</p>
        </div>
        <div className="task-detail-tools">
          <StatusBadge status={status} />
          <button className="button button-secondary button-small" type="button" onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Обновляем…' : 'Обновить'}
          </button>
        </div>
      </div>
      {queryError && (
        <div className="inline-warning" role="status">
          Не удалось обновить данные. Показана последняя загруженная версия. {getApiErrorMessage(queryError)}
        </div>
      )}

      <div className="task-editor-layout">
        <form className="editor-card" onSubmit={handleSave}>
          <div className="editor-card-heading">
            <span className="card-kicker">ПАРАМЕТРЫ ЗАДАЧИ</span>
            <span className="editor-id">#{task.id.slice(0, 8)}</span>
          </div>
          <label htmlFor="edit-title">Название задачи</label>
          <input
            id="edit-title"
            value={title}
            onChange={(event) => { setTitle(event.target.value); setMessage('') }}
            maxLength={120}
            required
          />
          <label htmlFor="edit-status">Статус</label>
          <select id="edit-status" value={status} onChange={(event) => { setStatus(event.target.value); setMessage('') }}>
            {STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          {message && <p className={message === 'Изменения сохранены.' ? 'form-success' : 'form-error'}>{message}</p>}
          {saveError && <p className="form-error">{getApiErrorMessage(saveError)}</p>}
          <div className="editor-actions">
            <button className="button button-primary" type="submit" disabled={isSaving || isDeleting}>
              {isSaving ? 'Сохраняем…' : 'Сохранить изменения'}
            </button>
            <Link className="button button-secondary" to={`/users/${task.userId}/tasks`}>Отмена</Link>
          </div>
        </form>

        <aside className="editor-aside">
          <div className="info-card">
            <p className="card-kicker">СВЕДЕНИЯ</p>
            <div className="detail-row"><span>Участник</span><strong>ID {task.userId}</strong></div>
            <div className="detail-row"><span>Текущий статус</span><StatusBadge status={status} /></div>
            <div className="detail-row"><span>Идентификатор</span><strong className="mono">{task.id}</strong></div>
          </div>
          <div className="danger-card">
            <strong>Удалить задачу</strong>
            <p>Это действие удалит задачу с сервера. Отменить его будет нельзя.</p>
            {deleteError && <p className="form-error">{getApiErrorMessage(deleteError)}</p>}
            {!confirmDelete ? (
              <button className="button button-danger button-full" type="button" onClick={() => setConfirmDelete(true)} disabled={isDeleting || isSaving}>
                Удалить задачу
              </button>
            ) : (
              <div className="delete-confirmation" role="group" aria-label="Подтверждение удаления">
                <p>Удалить задачу без возможности восстановления?</p>
                <div className="editor-actions">
                  <button className="button button-secondary" type="button" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>Отмена</button>
                  <button className="button button-danger" type="button" onClick={handleDelete} disabled={isDeleting || isSaving}>
                    {isDeleting ? 'Удаляем…' : 'Да, удалить'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
