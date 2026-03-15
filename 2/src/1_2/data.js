const filterByName = (name) => (place) => !name || place.name.toLowerCase().includes(name.toLowerCase());

const filterByYear = (yearFrom, yearTo) => (place) =>
    (!yearFrom || place.year >= yearFrom) && (!yearTo || place.year <= yearTo);

const filterByDistrict = (district) => (place) =>
    !district || place.district.toLowerCase().includes(district.toLowerCase());

const filterByAddress = (address) => (place) =>
    !address || place.address.toLowerCase().includes(address.toLowerCase());

const filterByType = (type) => (place) =>
    !type || place.type.toLowerCase().includes(type.toLowerCase());

const filterByLatitude = (latFrom, latTo) => (place) =>
    (!latFrom || place.lat >= parseFloat(latFrom)) &&
    (!latTo || place.lat <= parseFloat(latTo));

const filterByLongitude = (lonFrom, lonTo) => (place) =>
    (!lonFrom || place.lon >= parseFloat(lonFrom)) &&
    (!lonTo || place.lon <= parseFloat(lonTo));

const applyFilters = (places, filters) => {
    return places.filter(place => filters.every(filterFn => filterFn(place)));
}

const getFieldValue = (obj, field) => {
    switch (field) {
        case 'name':
            return obj.name;
        case 'year':
            return obj.year;
        case 'address':
            return obj.address;
        case 'district':
            return obj.district;
        case 'type':
            return obj.type;
        case 'latitude':
            return obj.lat;
        case 'longitude':
            return obj.lon;
        default:
            return '';
    }
}

const createComparator = (field, desc = false) => (a, b) => {
    if (field === 'none') return 0;

    const valueA = getFieldValue(a, field);
    const valueB = getFieldValue(b, field);

    let result;
    if (typeof valueA === 'number' && typeof valueB === 'number') {
        result = valueA - valueB;
    } else {
        result = String(valueA).localeCompare(String(valueB));
    }

    return desc ? -result : result
}

const sortPlaces = (places, sortLevels) => {
    return [...places].sort((a, b) => {
        for (const level of sortLevels) {
            const comparison = createComparator(level.field, level.desc)(a, b);
            if (comparison !== 0) return comparison;
        }

        return 0;
    })
}

const places = [
    {
        name: "Золотой мост",
        year: 2012,
        address: "Владивосток",
        district: "Первомайский",
        type: "мост",
        lat: 43.1156,
        lon: 131.8858
    },
    {
        name: "Русский мост",
        year: 2012,
        address: "Владивосток",
        district: "Первомайский",
        type: "мост",
        lat: 43.0447,
        lon: 131.9064
    },
    {
        name: "Владивостокская крепость",
        year: 1889,
        address: "ул. Батарейная, 4А",
        district: "Первомайский",
        type: "крепость",
        lat: 43.1198,
        lon: 131.8869
    },
    {
        name: "Приморский океанариум",
        year: 2016,
        address: "о. Русский, ул. Академика Касьянова, 25",
        district: "Первомайский",
        type: "музей",
        lat: 43.0230,
        lon: 131.9099
    },
    {
        name: "Токаревский маяк",
        year: 1876,
        address: "Токаревская кошка",
        district: "Первомайский",
        type: "маяк",
        lat: 43.0639,
        lon: 131.8047
    },
    {
        name: "Фуникулёр",
        year: 1962,
        address: "ул. Пушкинская, 25",
        district: "Первомайский",
        type: "транспорт",
        lat: 43.1142,
        lon: 131.8950
    },
    {
        name: "Железнодорожный вокзал",
        year: 1912,
        address: "ул. Алеутская, 2",
        district: "Первомайский",
        type: "вокзал",
        lat: 43.1056,
        lon: 131.8742
    },
    {
        name: "Орлиное гнездо",
        year: 1893,
        address: "Сопка Орлиное гнездо",
        district: "Первомайский",
        type: "смотровая площадка",
        lat: 43.1189,
        lon: 131.8989
    },
    {
        name: "Арка цесаревича",
        year: 1891,
        address: "Набережная Цесаревича",
        district: "Первомайский",
        type: "памятник",
        lat: 43.1164,
        lon: 131.8854
    },
    {
        name: "Покровский парк",
        year: 2013,
        address: "ул. Океанский проспект, 44",
        district: "Первореченский",
        type: "парк",
        lat: 43.1358,
        lon: 131.9142
    },
    {
        name: "Приморская государственная картинная галерея",
        year: 1966,
        address: "ул. Алеутская, 12",
        district: "Первомайский",
        type: "музей",
        lat: 43.1072,
        lon: 131.8761
    },
    {
        name: "Музей им. В.К. Арсеньева",
        year: 1884,
        address: "ул. Светланская, 20",
        district: "Первомайский",
        type: "музей",
        lat: 43.1150,
        lon: 131.8827
    },
    {
        name: "Подводная лодка С-56",
        year: 1975,
        address: "Корабельная набережная, 8",
        district: "Первомайский",
        type: "музей",
        lat: 43.1080,
        lon: 131.8923
    },
    {
        name: "Корабль-музей Красный вымпел",
        year: 1958,
        address: "Корабельная набережная, 3",
        district: "Первомайский",
        type: "музей",
        lat: 43.1075,
        lon: 131.8910
    },
    {
        name: "Набережная Спортивной гавани",
        year: 2012,
        address: "Спортивная гавань",
        district: "Первомайский",
        type: "набережная",
        lat: 43.1245,
        lon: 131.8925
    }
];