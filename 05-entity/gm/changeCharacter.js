import roleList from "../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/changeCharacter',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await Promise.all([
            connection.query(userRole, [req.user.id])
        ])
            .then((result) => {
                if (roleList[result[0][0].role]?.level >= 5) return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/change_type',
                    JSON.stringify({
                        entity: req.body.entityName,
                        entity_type: 'SYNTHETIC',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
                else return reply.code(403).send({message: 'Недостаточно прав'})
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_upgrade',
                    JSON.stringify({
                        entity: req.body.entityName,
                        upgrade: "cyberbrain",
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/wear_trinket',
                    JSON.stringify({
                        entity: req.body.entityName,
                        trinket: "human_only_trinket",
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/take_holdable',
                    JSON.stringify({
                        entity: req.body.entityName,
                        holdable: "wooden_stick_irgamesh",
                        upgrades: [],
                        hand: "main_hand"
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_bodypart',
                    JSON.stringify({
                        entity: req.body.entityName,
                        bodypart: 'skeletal_head',
                        key_name: 'skeletal_head',
                        curr_hp: 100,
                        time_to_live: 0,
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/wear_armor',
                    JSON.stringify({
                        entity: req.body.entityName,
                        wearable: 'kaska',
                        upgrades: [],
                        bodypart_key: 'skeletal_head',
                        bodypart: 'skeletal_head',
                        curr_durability: 100,
                        time_left: 0,
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/characters/add_narrative_perk',
                    JSON.stringify({
                        player: req.body.entityName,
                        perk_name: 'Приколократия',
                        perk_descritpion: "История про Мвдио от Мардука"
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_tag',
                    JSON.stringify({
                        entity: req.body.entityName,
                        tag: 'orc'
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/mod_skill',
                    JSON.stringify({
                        entity: req.body.entityName,
                        modified_object: "ELECTRODYNAMICS",
                        mod: "+20"
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'electric_charge',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'generic_evade',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'excessive_energy',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'plasma_dome',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'living_bolt',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'realization_of_potential',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'perfect_storm',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'leech',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'basic_telekinesis',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'small_mana_charge',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'shield_deformation',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                    JSON.stringify({
                        entity: req.body.entityName,
                        ability: 'frosts',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then(() => {
                return reply.send({message: 'Стандартные приколы накинуты'})
            })
            .catch((err) => reply.code(500).send(err.response.data))
            .finally(() => connection.release())
    },
}