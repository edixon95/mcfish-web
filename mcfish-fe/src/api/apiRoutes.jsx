export const apiRoutes = {
    BASE_URL: 'http://localhost:5000',

    players: {
        get: 'players/get',
        poll: 'players/poll'
    },

    fish: {
        get: 'fish/get'
    },

    rarity_weights: {
        get: 'rarity_weights/get'
    },

    menus: {
        get: 'menus/get',
        add: 'menus/add',
        update: 'menus/update'
    },

    config: {
        get: 'config/get',
        update: 'config/update'
    }
}