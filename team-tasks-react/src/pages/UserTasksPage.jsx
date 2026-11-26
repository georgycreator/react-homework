import { useEffect, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router'
import { useAddTaskMutation, useGetTasksQuery } from '../services/tasksApi'
import { getApiErrorMessage } from '../app/hooks'
import { TaskCard } from '../components/TaskCard'
import { EmptyState, ErrorState, LoadingState } from '../components/LoadingState'

const FILTERS = [
  { value: 'all', label: 'Все задачи' },
  { value: 'todo', label: 'К выполнению' },
  { value: 'doing', label: 'В работе' },
  { value: 'done', label: 'Готово' },
]
const VALID_STATUSES = new Set(['todo', 'doing', 'done'])

export function UserTasksPage() {
  const { user } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusValues = searchParams.getAll('status')
  const rawStatus = statusValues.length === 1 ? statusValues[0] : null
  const status = rawStatus && VALID_STATUSES.has(rawStatus) ? rawStatus : undefined
  const activeFilter = status || 'all'
  const { currentData, isLoading, isFetching, isError, error, refetch } = useGetTasksQuery({
    userId: user.id,
    status,
  })
  const [addTask, { isLoading: isAdding, error: addError }] = useAddTaskMutation()
  const [title, setTitle] = useState('')
  const [newStatus, setNewStatus] = useState('todo')
  const [formMessage, setFormMessage] = useState('')

  const tasks = currentData || []

  useEffect(() => {
    // Неизвестный или повторяющийся status не должен оставаться в URL как будто он применён.
    if (statusValues.length > 0 && status === undefined) {
      const next = new URLSearchParams(searchParams)
      next.delete('status')
      setSearchParams(next, { replace: true })
    }
  }, [rawStatus, searchParams, setSearchParams, status, statusValues.length])

  function changeFilter(value) {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('status')
    else next.set('status', value)
    setSearchParams(next)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isAdding) return
    const normalizedTitle = title.trim()
    if (!normalizedTitle) {
      setFormMessage('Введите название задачи.')
      return
    }
    setFormMessage('')
    try {
      await addTask({ userId: user.id, title: normalizedTitle, status: newStatus }).unwrap()
      setTitle('')
      setNewStatus('todo')
      setFormMessage(
        activeFilter === 'all' || activeFilter === newStatus
          ? 'Задача создана.'
          : 'Задача создана, но текущий фильтр скрывает её.'
      )
    } catch {
      // Значения формы остаются на месте, чтобы пользователь мог исправить запрос и повторить.
    }
  }

  return (
    <div className="tasks-page-grid">
      <div className="tasks-main-column">
        <div className="section-heading tasks-heading">
          <div>
            <h2>Задачи участника</h2>
            <p className="muted-label">Список синхронизируется с сервером</p>
          </div>
          <button type="button" className="button button-secondary button-small" onClick={() => refetch()} disabled={isFetching}>
            <span aria-hidden="true">↻</span> {isFetching ? 'Обновляем…' : 'Обновить'}
          </button>
        </div>

        <div className="filter-tabs" aria-label="Фильтр задач">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`filter-tab ${activeFilter === filter.value ? 'active' : ''}`}
              type="button"
              onClick={() => changeFilter(filter.value)}
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {(isLoading || (isFetching && !currentData)) && <LoadingState>Загружаем задачи…</LoadingState>}
        {isError && !currentData && <ErrorState message={getApiErrorMessage(error)} onRetry={refetch} />}
        {isError && currentData && <div className="inline-warning">Не удалось обновить список. Показаны последние загруженные данные.</div>}
        {isFetching && currentData && <p className="fetching-note">Обновляем список…</p>}
        {!isLoading && !isFetching && currentData !== undefined && tasks.length === 0 && (
          <EmptyState
            title="Задач пока нет"
            description={activeFilter === 'all' ? 'Создайте первую задачу для этого участника.' : 'Для выбранного статуса задач нет. Попробуйте другой фильтр.'}
          />
        )}
        {tasks.length > 0 && (
          <div className="task-list">
            {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </div>

      <aside className="create-task-card">
        <div className="create-card-icon">＋</div>
        <p className="card-kicker">НОВАЯ ЗАДАЧА</p>
        <h2>Добавить задачу</h2>
        <p className="form-intro">Задача будет сохранена на сервере и появится в списке участника.</p>
        <form onSubmit={handleSubmit} className="task-form">
          <label htmlFor="task-title">Название</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => { setTitle(event.target.value); setFormMessage('') }}
            placeholder="Например, подготовить отчёт"
            maxLength={120}
            required
          />
          <label htmlFor="task-status">Начальный статус</label>
          <select id="task-status" value={newStatus} onChange={(event) => setNewStatus(event.target.value)}>
            <option value="todo">К выполнению</option>
            <option value="doing">В работе</option>
            <option value="done">Готово</option>
          </select>
          {formMessage && <p aria-live="polite" className={formMessage.startsWith('Задача создана') ? 'form-success' : 'form-error'}>{formMessage}</p>}
          {addError && <p className="form-error">{getApiErrorMessage(addError)}</p>}
          <button className="button button-primary button-full" type="submit" disabled={isAdding}>
            {isAdding ? 'Сохраняем…' : 'Создать задачу'} <span aria-hidden="true">→</span>
          </button>
        </form>
      </aside>
    </div>
  )
}
