// Данные перенесены из сборки Nagruzki.dll: каталог потребителей СП 30.13330.2020 и таблица α.
const CONSUMER_CATALOG = [
  {
    "name": "Собственный водопотребитель",
    "defaultParameter": "Пользовательская норма",
    "unit": "1 пользователь",
    "defaultHours": "24",
    "isCustom": true,
    "parameterOptions": [
      {
        "groupName": "Пользовательская строка",
        "name": "Пользовательская норма",
        "unit": "1 пользователь",
        "defaultHours": "24",
        "totalDailyLiters": 0,
        "hotDailyLiters": 0,
        "totalPeakHourLiters": 0,
        "hotPeakHourLiters": 0,
        "totalDeviceLps": 0,
        "totalDeviceHourlyLiters": 0,
        "branchDeviceLps": 0,
        "branchDeviceHourlyLiters": 0,
        "isCustom": true,
        "sourceReference": "Пользовательский ввод"
      }
    ]
  },
  {
    "name": "Жилые дома квартирного типа",
    "defaultParameter": "с водопроводом и канализацией без ванн",
    "unit": "1 житель",
    "defaultHours": "24",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с водопроводом и канализацией без ванн",
        "unit": "1 житель",
        "defaultHours": "24",
        "totalDailyLiters": 70.0,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 5.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 50.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с водопроводом, канализацией и ваннами с водонагревателями, работающими на твердом топливе",
        "unit": "1 житель",
        "defaultHours": "24",
        "totalDailyLiters": 110.0,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 8.1,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.3,
        "branchDeviceHourlyLiters": 300.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с водопроводом, канализацией и ваннами с газовыми водонагревателями",
        "unit": "1 житель",
        "defaultHours": "24",
        "totalDailyLiters": 120.0,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 8.7,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.3,
        "branchDeviceHourlyLiters": 300.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с централизованным горячим водоснабжением, оборудованные умывальниками, мойками и душами",
        "unit": "1 житель",
        "defaultHours": "24",
        "totalDailyLiters": 130.0,
        "hotDailyLiters": 50.0,
        "totalPeakHourLiters": 8.2,
        "hotPeakHourLiters": 4.5,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с сидячими ваннами, оборудованными душами",
        "unit": "1 житель",
        "defaultHours": "24",
        "totalDailyLiters": 160.0,
        "hotDailyLiters": 65.0,
        "totalPeakHourLiters": 10.3,
        "hotPeakHourLiters": 5.7,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с ваннами длиной от 1500 мм, оборудованными душами",
        "unit": "1 житель",
        "defaultHours": "24",
        "totalDailyLiters": 180.0,
        "hotDailyLiters": 70.0,
        "totalPeakHourLiters": 11.6,
        "hotPeakHourLiters": 6.5,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Общежития",
    "defaultParameter": "с общими душевыми",
    "unit": "1 человек",
    "defaultHours": "24",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с общими душевыми",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 85.0,
        "hotDailyLiters": 45.0,
        "totalPeakHourLiters": 10.4,
        "hotPeakHourLiters": 5.4,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с душами при всех жилых комнатах",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 110.0,
        "hotDailyLiters": 50.0,
        "totalPeakHourLiters": 12.5,
        "hotPeakHourLiters": 7.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с общими кухнями и блоками душевых на этажах при жилых комнатах в каждой секции здания",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 120.0,
        "hotDailyLiters": 70.0,
        "totalPeakHourLiters": 10.2,
        "hotPeakHourLiters": 6.38,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Гостиницы, пансионаты и мотели",
    "defaultParameter": "с общими ваннами и душами",
    "unit": "1 человек",
    "defaultHours": "24",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с общими ваннами и душами",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 120.0,
        "hotDailyLiters": 60.0,
        "totalPeakHourLiters": 12.5,
        "hotPeakHourLiters": 7.0,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с душами во всех отдельных номерах",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 230.0,
        "hotDailyLiters": 120.0,
        "totalPeakHourLiters": 19.0,
        "hotPeakHourLiters": 10.2,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 115.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 80.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с ваннами в отдельных номерах, % общего числа номеров до 25",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 200.0,
        "hotDailyLiters": 85.0,
        "totalPeakHourLiters": 22.4,
        "hotPeakHourLiters": 8.8,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 250.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 180.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с ваннами в отдельных номерах, % общего числа номеров до 75",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 250.0,
        "hotDailyLiters": 130.0,
        "totalPeakHourLiters": 28.0,
        "hotPeakHourLiters": 12.8,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 280.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 190.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с ваннами в отдельных номерах, % общего числа номеров до 100",
        "unit": "1 человек",
        "defaultHours": "24",
        "totalDailyLiters": 300.0,
        "hotDailyLiters": 160.0,
        "totalPeakHourLiters": 30.0,
        "hotPeakHourLiters": 13.6,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Больницы",
    "defaultParameter": "с общими ваннами и душевыми",
    "unit": "1 койка",
    "defaultHours": "24",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с общими ваннами и душевыми",
        "unit": "1 койка",
        "defaultHours": "24",
        "totalDailyLiters": 115.0,
        "hotDailyLiters": 65.0,
        "totalPeakHourLiters": 8.4,
        "hotPeakHourLiters": 4.6,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с санузлами, приближенными к палатам",
        "unit": "1 койка",
        "defaultHours": "24",
        "totalDailyLiters": 200.0,
        "hotDailyLiters": 75.0,
        "totalPeakHourLiters": 12.0,
        "hotPeakHourLiters": 6.55,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "инфекционные",
        "unit": "1 койка",
        "defaultHours": "24",
        "totalDailyLiters": 240.0,
        "hotDailyLiters": 95.0,
        "totalPeakHourLiters": 14.0,
        "hotPeakHourLiters": 8.1,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 200.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 120.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Санатории и дома отдыха",
    "defaultParameter": "с общими душами",
    "unit": "1 место",
    "defaultHours": "24",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с общими душами",
        "unit": "1 место",
        "defaultHours": "24",
        "totalDailyLiters": 130.0,
        "hotDailyLiters": 55.0,
        "totalPeakHourLiters": 12.5,
        "hotPeakHourLiters": 7.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с душами при всех жилых комнатах",
        "unit": "1 место",
        "defaultHours": "24",
        "totalDailyLiters": 150.0,
        "hotDailyLiters": 65.0,
        "totalPeakHourLiters": 12.5,
        "hotPeakHourLiters": 7.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с ваннами при всех жилых комнатах",
        "unit": "1 место",
        "defaultHours": "24",
        "totalDailyLiters": 200.0,
        "hotDailyLiters": 100.0,
        "totalPeakHourLiters": 10.0,
        "hotPeakHourLiters": 4.2,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Поликлиники и амбулатории",
    "defaultParameter": "стандартный режим",
    "unit": "1 больной в смену",
    "defaultHours": "10",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "стандартный режим",
        "unit": "1 больной в смену",
        "defaultHours": "10",
        "totalDailyLiters": 13.0,
        "hotDailyLiters": 4.4,
        "totalPeakHourLiters": 2.6,
        "hotPeakHourLiters": 1.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Дошкольные образовательные организации",
    "defaultParameter": "со столовыми, работающими на полуфабрикатах",
    "unit": "1 ребенок",
    "defaultHours": "10",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "со столовыми, работающими на полуфабрикатах",
        "unit": "1 ребенок",
        "defaultHours": "10",
        "totalDailyLiters": 22.0,
        "hotDailyLiters": 10.0,
        "totalPeakHourLiters": 9.5,
        "hotPeakHourLiters": 3.8,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "со столовыми, работающими на сырье, и прачечными, оборудованными автоматическими стиральными машинами",
        "unit": "1 ребенок",
        "defaultHours": "10",
        "totalDailyLiters": 60.0,
        "hotDailyLiters": 21.0,
        "totalPeakHourLiters": 18.0,
        "hotPeakHourLiters": 6.8,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с круглосуточным пребыванием детей; со столовыми, работающими на полуфабрикатах",
        "unit": "1 ребенок",
        "defaultHours": "24",
        "totalDailyLiters": 40.0,
        "hotDailyLiters": 20.0,
        "totalPeakHourLiters": 10.0,
        "hotPeakHourLiters": 3.8,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "с круглосуточным пребыванием детей; со столовыми, работающими на сырье, и прачечными, оборудованными автоматическими стиральными машинами",
        "unit": "1 ребенок",
        "defaultHours": "24",
        "totalDailyLiters": 90.0,
        "hotDailyLiters": 25.0,
        "totalPeakHourLiters": 18.0,
        "hotPeakHourLiters": 6.8,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Прачечные",
    "defaultParameter": "механизированные",
    "unit": "1 кг сухого белья",
    "defaultHours": "24",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "механизированные",
        "unit": "1 кг сухого белья",
        "defaultHours": "24",
        "totalDailyLiters": 75.0,
        "hotDailyLiters": 21.3,
        "totalPeakHourLiters": 75.0,
        "hotPeakHourLiters": 21.3,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "немеханизированные",
        "unit": "1 кг сухого белья",
        "defaultHours": "24",
        "totalDailyLiters": 40.0,
        "hotDailyLiters": 12.8,
        "totalPeakHourLiters": 40.0,
        "hotPeakHourLiters": 12.8,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Административные здания",
    "defaultParameter": "стандартный режим",
    "unit": "1 работающий",
    "defaultHours": "8",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "стандартный режим",
        "unit": "1 работающий",
        "defaultHours": "8",
        "totalDailyLiters": 12.0,
        "hotDailyLiters": 4.5,
        "totalPeakHourLiters": 4.0,
        "hotPeakHourLiters": 1.7,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Общеобразовательные организации профессионального и высшего образования",
    "defaultParameter": "с душевыми при гимнастических залах и буфетами",
    "unit": "1 учащийся и 1 преподаватель",
    "defaultHours": "8",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с душевыми при гимнастических залах и буфетами",
        "unit": "1 учащийся и 1 преподаватель",
        "defaultHours": "8",
        "totalDailyLiters": 17.2,
        "hotDailyLiters": 5.0,
        "totalPeakHourLiters": 2.7,
        "hotPeakHourLiters": 1.0,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Лаборатории общеобразовательных организаций и организаций профессионального и высшего образования",
    "defaultParameter": "стандартный режим",
    "unit": "1 прибор в смену",
    "defaultHours": "8",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "стандартный режим",
        "unit": "1 прибор в смену",
        "defaultHours": "8",
        "totalDailyLiters": 220.0,
        "hotDailyLiters": 95.0,
        "totalPeakHourLiters": 43.2,
        "hotPeakHourLiters": 18.4,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 200.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Общеобразовательные организации",
    "defaultParameter": "с душевыми при гимнастических залах и столовыми, работающими на полуфабрикатах",
    "unit": "1 учащийся и 1 преподаватель",
    "defaultHours": "8",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с душевыми при гимнастических залах и столовыми, работающими на полуфабрикатах",
        "unit": "1 учащийся и 1 преподаватель",
        "defaultHours": "8",
        "totalDailyLiters": 10.0,
        "hotDailyLiters": 2.5,
        "totalPeakHourLiters": 3.1,
        "hotPeakHourLiters": 0.85,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "то же, с продленным днем",
        "unit": "1 учащийся и 1 преподаватель",
        "defaultHours": "8",
        "totalDailyLiters": 12.0,
        "hotDailyLiters": 2.9,
        "totalPeakHourLiters": 3.1,
        "hotPeakHourLiters": 0.85,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Общеобразовательные организации-интернаты",
    "defaultParameter": "учебные (с душевыми при гимнастических залах)",
    "unit": "1 учащийся и 1 преподаватель",
    "defaultHours": "24",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "учебные (с душевыми при гимнастических залах)",
        "unit": "1 учащийся и 1 преподаватель",
        "defaultHours": "24",
        "totalDailyLiters": 9.0,
        "hotDailyLiters": 2.7,
        "totalPeakHourLiters": 3.1,
        "hotPeakHourLiters": 0.85,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "спальные",
        "unit": "1 место",
        "defaultHours": "24",
        "totalDailyLiters": 70.0,
        "hotDailyLiters": 30.0,
        "totalPeakHourLiters": 9.0,
        "hotPeakHourLiters": 5.1,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 100.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Аптеки",
    "defaultParameter": "торговый зал и подсобные помещения",
    "unit": "1 место",
    "defaultHours": "12",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "торговый зал и подсобные помещения",
        "unit": "1 место",
        "defaultHours": "12",
        "totalDailyLiters": 12.0,
        "hotDailyLiters": 4.0,
        "totalPeakHourLiters": 4.0,
        "hotPeakHourLiters": 1.7,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 60.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 40.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "лаборатория приготовления лекарств",
        "unit": "1 место",
        "defaultHours": "12",
        "totalDailyLiters": 310.0,
        "hotDailyLiters": 47.0,
        "totalPeakHourLiters": 32.0,
        "hotPeakHourLiters": 7.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Предприятия общественного питания",
    "defaultParameter": "реализуемой в обеденном зале",
    "unit": "1 условное блюдо, в т.ч. 2 л на мытье",
    "defaultHours": "10",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "реализуемой в обеденном зале",
        "unit": "1 условное блюдо, в т.ч. 2 л на мытье",
        "defaultHours": "10",
        "totalDailyLiters": 12.0,
        "hotDailyLiters": 3.4,
        "totalPeakHourLiters": 12.0,
        "hotPeakHourLiters": 3.4,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "продаваемой на дом",
        "unit": "1 условное блюдо, в т.ч. 2 л на мытье",
        "defaultHours": "10",
        "totalDailyLiters": 10.0,
        "hotDailyLiters": 2.6,
        "totalPeakHourLiters": 10.0,
        "hotPeakHourLiters": 2.6,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Магазины",
    "defaultParameter": "продовольственные",
    "unit": "1 работающий в смену (20 м² торгового зала)",
    "defaultHours": "8",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "продовольственные",
        "unit": "1 работающий в смену (20 м² торгового зала)",
        "defaultHours": "8",
        "totalDailyLiters": 250.0,
        "hotDailyLiters": 55.0,
        "totalPeakHourLiters": 37.0,
        "hotPeakHourLiters": 8.2,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 300.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 200.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "промтоварные",
        "unit": "1 работающий в смену",
        "defaultHours": "8",
        "totalDailyLiters": 12.0,
        "hotDailyLiters": 4.0,
        "totalPeakHourLiters": 4.0,
        "hotPeakHourLiters": 1.7,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 60.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Парикмахерские",
    "defaultParameter": "стандартный режим",
    "unit": "1 рабочее место в смену",
    "defaultHours": "12",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "стандартный режим",
        "unit": "1 рабочее место в смену",
        "defaultHours": "12",
        "totalDailyLiters": 56.0,
        "hotDailyLiters": 28.0,
        "totalPeakHourLiters": 9.0,
        "hotPeakHourLiters": 4.0,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 60.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 40.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Кинотеатры",
    "defaultParameter": "стандартный режим",
    "unit": "1 место",
    "defaultHours": "4",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "стандартный режим",
        "unit": "1 место",
        "defaultHours": "4",
        "totalDailyLiters": 4.0,
        "hotDailyLiters": 1.3,
        "totalPeakHourLiters": 0.5,
        "hotPeakHourLiters": 0.17,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Клубы",
    "defaultParameter": "стандартный режим",
    "unit": "1 место",
    "defaultHours": "4",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "стандартный режим",
        "unit": "1 место",
        "defaultHours": "4",
        "totalDailyLiters": 8.6,
        "hotDailyLiters": 2.2,
        "totalPeakHourLiters": 0.9,
        "hotPeakHourLiters": 0.34,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Театры",
    "defaultParameter": "для зрителей",
    "unit": "1 место",
    "defaultHours": "4",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "для зрителей",
        "unit": "1 место",
        "defaultHours": "4",
        "totalDailyLiters": 10.0,
        "hotDailyLiters": 4.0,
        "totalPeakHourLiters": 0.9,
        "hotPeakHourLiters": 0.26,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 60.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 40.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "для артистов",
        "unit": "1 артист",
        "defaultHours": "8",
        "totalDailyLiters": 40.0,
        "hotDailyLiters": 21.0,
        "totalPeakHourLiters": 3.4,
        "hotPeakHourLiters": 1.9,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Стадионы и спортзалы",
    "defaultParameter": "для зрителей",
    "unit": "1 место",
    "defaultHours": "4",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "для зрителей",
        "unit": "1 место",
        "defaultHours": "4",
        "totalDailyLiters": 3.0,
        "hotDailyLiters": 0.85,
        "totalPeakHourLiters": 0.3,
        "hotPeakHourLiters": 0.09,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 60.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 40.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "для физкультурников (с учетом приема душа)",
        "unit": "1 физкультурник",
        "defaultHours": "11",
        "totalDailyLiters": 50.0,
        "hotDailyLiters": 25.0,
        "totalPeakHourLiters": 4.5,
        "hotPeakHourLiters": 2.5,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "для спортсменов (с учетом приема душа)",
        "unit": "1 спортсмен",
        "defaultHours": "11",
        "totalDailyLiters": 100.0,
        "hotDailyLiters": 51.0,
        "totalPeakHourLiters": 9.0,
        "hotPeakHourLiters": 4.3,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Плавательные бассейны",
    "defaultParameter": "для зрителей",
    "unit": "1 место",
    "defaultHours": "8",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "для зрителей",
        "unit": "1 место",
        "defaultHours": "8",
        "totalDailyLiters": 3.0,
        "hotDailyLiters": 0.85,
        "totalPeakHourLiters": 0.3,
        "hotPeakHourLiters": 0.09,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 60.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "для спортсменов (с учетом приема душа)",
        "unit": "1 спортсмен",
        "defaultHours": "8",
        "totalDailyLiters": 100.0,
        "hotDailyLiters": 51.0,
        "totalPeakHourLiters": 9.0,
        "hotPeakHourLiters": 4.3,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 80.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 50.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "пополнение бассейна, % вместимости бассейна в сутки",
        "unit": "% вместимости бассейна в сутки",
        "defaultHours": "8",
        "totalDailyLiters": 10.0,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Бани",
    "defaultParameter": "для мытья в мыльной с тазами на скамьях и ополаскиванием в душе",
    "unit": "1 посетитель",
    "defaultHours": "3",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "для мытья в мыльной с тазами на скамьях и ополаскиванием в душе",
        "unit": "1 посетитель",
        "defaultHours": "3",
        "totalDailyLiters": 180.0,
        "hotDailyLiters": 100.0,
        "totalPeakHourLiters": 180.0,
        "hotPeakHourLiters": 100.0,
        "totalDeviceLps": 0.4,
        "totalDeviceHourlyLiters": 180.0,
        "branchDeviceLps": 0.4,
        "branchDeviceHourlyLiters": 120.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "то же, с приемом оздоровительных процедур и ополаскиванием в душе",
        "unit": "1 посетитель",
        "defaultHours": "3",
        "totalDailyLiters": 290.0,
        "hotDailyLiters": 160.0,
        "totalPeakHourLiters": 290.0,
        "hotPeakHourLiters": 160.0,
        "totalDeviceLps": 0.4,
        "totalDeviceHourlyLiters": 290.0,
        "branchDeviceLps": 0.4,
        "branchDeviceHourlyLiters": 190.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "душевая кабина",
        "unit": "1 посетитель",
        "defaultHours": "3",
        "totalDailyLiters": 360.0,
        "hotDailyLiters": 200.0,
        "totalPeakHourLiters": 360.0,
        "hotPeakHourLiters": 200.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 360.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 240.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "ванная кабина",
        "unit": "1 посетитель",
        "defaultHours": "3",
        "totalDailyLiters": 540.0,
        "hotDailyLiters": 300.0,
        "totalPeakHourLiters": 540.0,
        "hotPeakHourLiters": 300.0,
        "totalDeviceLps": 0.3,
        "totalDeviceHourlyLiters": 540.0,
        "branchDeviceLps": 0.2,
        "branchDeviceHourlyLiters": 360.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Душевые в бытовых помещениях промышленных предприятий",
    "defaultParameter": "1 душевая сетка в смену",
    "unit": "1 душевая сетка в смену",
    "defaultHours": "1",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "1 душевая сетка в смену",
        "unit": "1 душевая сетка в смену",
        "defaultHours": "1",
        "totalDailyLiters": 500.0,
        "hotDailyLiters": 230.0,
        "totalPeakHourLiters": 500.0,
        "hotPeakHourLiters": 230.0,
        "totalDeviceLps": 0.2,
        "totalDeviceHourlyLiters": 500.0,
        "branchDeviceLps": 0.14,
        "branchDeviceHourlyLiters": 270.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Цехи",
    "defaultParameter": "с тепловыделениями св. 84 кДж на 1 м³/ч",
    "unit": "1 чел. в смену",
    "defaultHours": "6",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "с тепловыделениями св. 84 кДж на 1 м³/ч",
        "unit": "1 чел. в смену",
        "defaultHours": "6",
        "totalDailyLiters": 45.0,
        "hotDailyLiters": 20.4,
        "totalPeakHourLiters": 14.1,
        "hotPeakHourLiters": 7.1,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 60.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 40.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "остальные цеха",
        "unit": "1 чел. в смену",
        "defaultHours": "8",
        "totalDailyLiters": 25.0,
        "hotDailyLiters": 9.4,
        "totalPeakHourLiters": 9.4,
        "hotPeakHourLiters": 3.7,
        "totalDeviceLps": 0.14,
        "totalDeviceHourlyLiters": 60.0,
        "branchDeviceLps": 0.1,
        "branchDeviceHourlyLiters": 40.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Полив территории",
    "defaultParameter": "травяного покрова",
    "unit": "1 м²",
    "defaultHours": "1",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "травяного покрова",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 3.0,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "футбольного поля",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 0.5,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "остальных спортивных сооружений",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 1.5,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "усовершенствованных покрытий, тротуаров, площадей, заводских проездов (0.4 л/м²)",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 0.4,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "усовершенствованных покрытий, тротуаров, площадей, заводских проездов (0.5 л/м²)",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 0.5,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "зеленых насаждений, газонов и цветников (3 л/м²)",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 3.0,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      },
      {
        "groupName": "Параметры",
        "name": "зеленых насаждений, газонов и цветников (6 л/м²)",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 6.0,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  },
  {
    "name": "Заливка поверхности катка",
    "defaultParameter": "стандартный режим",
    "unit": "1 м²",
    "defaultHours": "1",
    "isCustom": false,
    "parameterOptions": [
      {
        "groupName": "Параметры",
        "name": "стандартный режим",
        "unit": "1 м²",
        "defaultHours": "1",
        "totalDailyLiters": 0.5,
        "hotDailyLiters": 0.0,
        "totalPeakHourLiters": 0.0,
        "hotPeakHourLiters": 0.0,
        "totalDeviceLps": 0.0,
        "totalDeviceHourlyLiters": 0.0,
        "branchDeviceLps": 0.0,
        "branchDeviceHourlyLiters": 0.0,
        "sourceReference": "СП 30.13330.2020, таблица А.2 (редакция с изм. №1-5)"
      }
    ]
  }
];

const ALPHA_POINTS = [[0.015,0.202],[0.016,0.205],[0.017,0.207],[0.018,0.21],[0.019,0.212],[0.02,0.215],[0.021,0.217],[0.022,0.219],[0.023,0.222],[0.024,0.224],[0.025,0.226],[0.026,0.228],[0.027,0.23],[0.028,0.233],[0.029,0.235],[0.03,0.237],[0.031,0.239],[0.032,0.241],[0.033,0.243],[0.034,0.245],[0.035,0.247],[0.036,0.249],[0.037,0.25],[0.038,0.252],[0.039,0.254],[0.04,0.256],[0.041,0.258],[0.042,0.259],[0.043,0.261],[0.044,0.263],[0.045,0.265],[0.046,0.266],[0.047,0.268],[0.048,0.27],[0.049,0.271],[0.05,0.273],[0.052,0.276],[0.054,0.28],[0.056,0.283],[0.058,0.286],[0.06,0.289],[0.062,0.292],[0.064,0.295],[0.065,0.298],[0.068,0.301],[0.07,0.304],[0.072,0.307],[0.074,0.309],[0.076,0.312],[0.078,0.315],[0.08,0.318],[0.082,0.32],[0.084,0.323],[0.086,0.326],[0.088,0.328],[0.09,0.331],[0.092,0.333],[0.094,0.336],[0.096,0.338],[0.098,0.341],[0.1,0.343],[0.105,0.349],[0.11,0.355],[0.115,0.361],[0.12,0.367],[0.125,0.373],[0.13,0.378],[0.135,0.384],[0.14,0.389],[0.145,0.394],[0.15,0.399],[0.155,0.405],[0.16,0.41],[0.165,0.415],[0.17,0.42],[0.175,0.425],[0.18,0.43],[0.185,0.435],[0.19,0.439],[0.195,0.444],[0.2,0.449],[0.21,0.458],[0.22,0.467],[0.23,0.476],[0.24,0.485],[0.25,0.493],[0.26,0.502],[0.27,0.51],[0.28,0.518],[0.29,0.526],[0.3,0.534],[0.31,0.542],[0.32,0.55],[0.33,0.558],[0.34,0.565],[0.35,0.573],[0.36,0.58],[0.37,0.588],[0.38,0.595],[0.39,0.602],[0.4,0.61],[0.41,0.617],[0.42,0.624],[0.43,0.631],[0.44,0.638],[0.45,0.645],[0.46,0.652],[0.47,0.658],[0.48,0.665],[0.49,0.672],[0.5,0.678],[0.52,0.692],[0.54,0.704],[0.56,0.717],[0.58,0.73],[0.6,0.742],[0.62,0.755],[0.64,0.767],[0.66,0.779],[0.68,0.791],[0.7,0.803],[0.72,0.815],[0.74,0.826],[0.76,0.838],[0.78,0.849],[0.8,0.86],[0.82,0.872],[0.84,0.883],[0.86,0.894],[0.88,0.905],[0.9,0.916],[0.94,0.937],[0.98,0.958],[1.0,0.969],[1.05,0.995],[1.1,1.021],[1.15,1.046],[1.2,1.071],[1.25,1.096],[1.3,1.12],[1.4,1.168],[1.5,1.215],[1.55,1.238],[1.6,1.261],[1.65,1.283],[1.7,1.306],[1.75,1.328],[1.8,1.35],[1.85,1.372],[1.9,1.394],[2.0,1.438],[2.2,1.521],[2.4,1.604],[2.5,1.644],[2.7,1.724],[2.9,1.802],[3.1,1.879],[3.2,1.917],[3.4,1.991],[3.5,2.029],[3.6,2.065],[3.7,2.102],[3.8,2.138],[3.9,2.174],[4.0,2.21],[4.1,2.246],[4.2,2.281],[4.3,2.317],[4.4,2.352],[4.5,2.386],[4.6,2.421],[4.7,2.456],[4.8,2.49],[4.9,2.524],[5.0,2.558],[5.1,2.592],[5.2,2.626],[5.3,2.66],[5.4,2.693],[5.5,2.726],[5.6,2.76],[5.7,2.793],[5.8,2.826],[5.9,2.858],[6.0,2.891],[6.1,2.924],[6.2,2.956],[6.3,2.989],[6.4,3.021],[6.5,3.053],[6.6,3.085],[6.7,3.117],[6.8,3.149],[6.9,3.181],[7.0,3.212],[7.1,3.244],[7.2,3.275],[7.3,3.307],[7.4,3.338],[7.5,3.369],[7.6,3.4],[7.7,3.431],[7.8,3.462],[7.9,3.493],[8.0,3.524],[8.1,3.555],[8.2,3.586],[8.3,3.616],[8.4,3.647],[8.5,3.677],[8.6,3.707],[8.7,3.738],[8.8,3.768],[9.0,3.828],[9.1,3.858],[9.2,3.888],[9.3,3.918],[9.4,3.948],[9.6,4.007],[9.8,4.067],[10.0,4.126],[10.2,4.185],[10.4,4.244],[10.6,4.302],[10.8,4.36],[11.0,4.417],[11.2,4.477],[11.4,4.534],[11.6,4.592],[11.8,4.649],[12.0,4.707],[12.2,4.764],[12.4,4.82],[12.6,4.877],[12.8,4.934],[13.0,4.99],[13.2,5.047],[13.4,5.103],[13.6,5.159],[13.8,5.215],[14.0,5.27],[14.2,5.326],[14.4,5.382],[14.6,5.437],[14.8,5.492],[15.0,5.547],[15.2,5.602],[15.4,5.657],[15.6,5.712],[15.8,5.767],[16.0,5.821],[16.2,5.876],[16.4,5.93],[16.6,5.984],[16.8,6.039],[17.0,6.093],[17.2,6.147],[17.4,6.201],[17.6,6.254],[17.8,6.308],[18.0,6.362],[18.2,6.415],[18.4,6.469],[18.6,6.522],[18.8,6.575],[19.0,6.629],[19.2,6.682],[19.4,6.735],[19.6,6.787],[19.8,6.84],[20.0,6.893],[20.5,7.026],[21.0,7.157],[21.5,7.287],[22.0,7.417],[22.5,7.546],[23.0,7.675],[23.5,7.803],[24.0,7.931],[24.5,8.064],[25.0,8.192]];
