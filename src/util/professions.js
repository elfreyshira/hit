// health ranges from 10 - 20, depending on power of profession Skill
// hit filter: hits are checked to adjust damage to the player
// turn filter: events that happen after all skills are performed
export const PROFESSIONS = {
  TANK_HEALTH: {
    name: 'Tankilicious',
    quote: "ME TANK. YOU HIT.",
    description: `You can't do much, but you have a LOT of health.`,

    startingHealth: 20,
    possibleSkills: ['HIT_2']
  },

  TANK_ARMOR: {
    name: 'Duke Devlin',
    quote: 'Ow that barely hurt.',
    description: `Each turn, you cannot lose more than 2 health.`,

    startingHealth: 14,
    possibleSkills: ['HIT_2'],
    hitFilter: 'NO_MORE_THAN_2'
  },

  TANK_SQUISHY: {
    name: 'Jellyfish',
    quote: 'I am squishy.',
    description: `If you receive 2 or less damage in a turn, it's negated.`,

    startingHealth: 10,
    possibleSkills: ['HIT_2'],
    hitFilter: 'NO_DAMAGE_IF_2_OR_LESS'
  },

  TANK_AUTO_HEAL: {
    name: 'Groot',
    quote: 'We are Groot.',
    description: `You recover 1 health at the end of every turn.`,

    startingHealth: 12,
    possibleSkills: ['HIT_2'],
    postHitFilter: 'HEAL_BY_1'
  },

  ASSASSIN_NORMAL_LOW: {
    name: 'Ninjamaican me crazy',
    quote: `Ayy, I'm killin' here!`,
    description: `You can hit somebody for 3 damage.`,

    startingHealth: 13,
    possibleSkills: ['HIT_2', 'HIT_3']
  },

  ASSASSIN_NORMAL_HIGH: {
    name: 'Killa',
    quote: `*killing intensifies*`,
    description: `You can hit somebody for 4 damage.`,

    startingHealth: 10,
    possibleSkills: ['HIT_2', 'HIT_4']
  },

  SUPPORT_HEAL_NORMAL_LOW: {
    name: 'Rick Astley',
    quote: `We're no strangers to love.`,
    description: `You bring healing with the power of song. You can heal somebody for 2 health.`,

    startingHealth: 16,
    possibleSkills: ['HIT_2', 'HEAL_2']
  },

  SUPPORT_HEAL_NORMAL_MED: {
    name: 'Healaga',
    quote: `I heal, you kill.`,
    description: `You can heal somebody for 3 health.`,

    startingHealth: 13,
    possibleSkills: ['HIT_2', 'HEAL_3']
  },

  SUPPORT_HEAL_NORMAL_HIGH: {
    name: 'Rick Astley - Final Form',
    quote: `NEVER GONNA GIVE YOU UP!`,
    description: `You can heal somebody for 4 health.`,

    startingHealth: 10,
    possibleSkills: ['HIT_2', 'HEAL_4']
  }
}


export const SKILLS = {
  HIT_2: {
    name: 'Hit for 2 damage.',
    priority: 2,
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - 2
    }
  },
  HIT_3: {
    name: 'Hit for 3 damage.',
    priority: 2,
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - 3
    }
  },
  HIT_4: {
    name: 'Hit for 4 damage.',
    priority: 2,
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - 4
    }
  },
  HEAL_2: {
    name: 'Heal for 2 health.',
    priority: 3,
    doSkill (playersState, payload) {
      const {player, target} = payload
      const healedHealth = playersState[target].health + 2
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(healedHealth, maxHealth)
    }
  },
  HEAL_3: {
    name: 'Heal for 3 health.',
    priority: 3,
    doSkill (playersState, payload) {
      const {player, target} = payload
      const healedHealth = playersState[target].health + 3
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(healedHealth, maxHealth)
    }
  },
  HEAL_4: {
    name: 'Heal for 4 health.',
    priority: 3,
    doSkill (playersState, payload) {
      const {player, target} = payload
      const healedHealth = playersState[target].health + 4
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(healedHealth, maxHealth)
    }
  }
}

export default {
  PROFESSIONS,
  SKILLS
}