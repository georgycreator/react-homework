import { Component } from 'react'

export class AppErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Ошибка сохраняется в консоли для диагностики, но не раскрывается пользователю.
    console.error('Ошибка интерфейса:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error" role="alert">
          <p className="eyebrow">НЕПРЕДВИДЕННАЯ ОШИБКА</p>
          <h1>Не удалось отобразить страницу</h1>
          <p>Обновите страницу. Если ошибка повторяется, проверьте консоль разработчика.</p>
          <button className="button button-primary" type="button" onClick={() => window.location.reload()}>
            Перезагрузить приложение
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
