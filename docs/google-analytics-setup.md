# Google Analytics Setup Guide

## 1. Получение Google Analytics ID

1. Зайдите в [Google Analytics](https://analytics.google.com/)
2. Создайте новый аккаунт или войдите в существующий
3. Создайте новое свойство (Property) для вашего сайта
4. Выберите "Web" как платформу
5. Скопируйте **Measurement ID** (формат: `G-XXXXXXXXXX`)

## 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

**⚠️ Важно**: Замените `G-XXXXXXXXXX` на ваш реальный Measurement ID.

## 3. Установленные компоненты

✅ **Google Analytics скрипты** добавлены в `app/layout.tsx`
✅ **Автоматический трекинг страниц** через `GoogleAnalyticsProvider`
✅ **Утилиты для трекинга** в `lib/gtag.ts`

## 4. Доступные функции трекинга

### Автоматический трекинг
- ✅ **Переходы между страницами** - автоматически
- ✅ **Поисковые запросы в чате** - при отправке сообщения
- ✅ **Бронирования ресторанов** - при клике "Reserve"
- ✅ **Бронирования активностей** - при клике "Book"

### Ручной трекинг (доступные функции)

```typescript
import { trackBooking, trackSearch, trackMapInteraction, event } from '@/lib/gtag'

// Трекинг бронирований
trackBooking('hotel', 'Hotel Name')
trackBooking('restaurant', 'Restaurant Name') 
trackBooking('activity', 'Activity Name')

// Трекинг поиска
trackSearch('hotels in Paris', 'hotel')

// Трекинг карты
trackMapInteraction('open')
trackMapInteraction('close')
trackMapInteraction('marker_click')

// Кастомные события
event({
  action: 'click',
  category: 'button',
  label: 'header-login',
  value: 1
})
```

## 5. Проверка работы

1. **Откройте сайт в браузере**
2. **Откройте DevTools** (F12)
3. **Перейдите на вкладку Console**
4. **Выполните действия** (поиск, бронирование, переходы)
5. **Проверьте Google Analytics** (данные появляются через 24-48 часов)

### Для немедленной проверки:
- Используйте **Google Analytics DebugView**
- Или установите расширение **Google Analytics Debugger**

## 6. События которые отслеживаются

| Событие | Описание | Параметры |
|---------|----------|-----------|
| `page_view` | Просмотр страницы | `page_path`, `page_title` |
| `search` | Поиск в чате | `search_term`, `category: 'chat'` |
| `booking` | Бронирование | `category: 'hotel/restaurant/activity'`, `item_name` |
| `map_interaction` | Взаимодействие с картой | `action: 'open/close/marker_click'` |

## 7. Дополнительные настройки

### Для отключения в разработке:
```typescript
// В .env.local
NEXT_PUBLIC_GA_TRACKING_ID=  # Оставьте пустым
```

### Для настройки конфиденциальности:
```typescript
// В lib/gtag.ts добавьте:
gtag('config', GA_TRACKING_ID, {
  page_path: url,
  anonymize_ip: true,        // Анонимизация IP
  send_page_view: false      // Отключить автоматические просмотры
})
```

## 8. Troubleshooting

### Проблема: События не отправляются
- ✅ Проверьте правильность `GA_TRACKING_ID`
- ✅ Убедитесь что переменная начинается с `NEXT_PUBLIC_`
- ✅ Перезапустите dev сервер после изменения .env

### Проблема: Данные не появляются в GA
- ⏱️ Подождите 24-48 часов для обычных отчетов
- 🔍 Используйте DebugView для проверки в реальном времени
- 🧪 Проверьте в режиме инкогнито

### Проблема: Console ошибки
- 🔧 Убедитесь что gtag загружен до вызова функций
- 🔧 Проверьте что компонент работает только на клиенте (`"use client"`)

## 9. Полезные ссылки

- [Google Analytics Dashboard](https://analytics.google.com/)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics) 