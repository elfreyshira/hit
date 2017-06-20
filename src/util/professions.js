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
    description: `You recover 1 health every turn.`,

    startingHealth: 12,
    possibleSkills: ['HIT_2'],
    postTurnStep: 'HEAL_BY_1'
  },

  TANK_DOUBLE_DAMAGE_HEAL: {
    name: 'Mammoth',
    quote: 'Tis just a flesh wound.',
    description: `You receive double hit damage, but you recover 2 health every turn.`,

    startingHealth: 20,
    possibleSkills: ['HIT_2'],
    hitFilter: 'RECEIVE_DOUBLE_DAMAGE',
    postTurnStep: 'HEAL_BY_2'
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


function createHitSkillObj (hitAmount) {
  return {
    name: 'Hit for ' + hitAmount + ' damage.',
    type: 'HIT',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = Math.max(playersState[target].health - hitAmount, 0)
    }
  }
}

function createHealSkillObj (healAmount) {
  return {
    name: 'Heal for ' + healAmount + ' health.',
    type: 'HEAL',
    doSkill (playersState, payload) {
      const {player, target} = payload
      const healedHealth = playersState[target].health + healAmount
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(healedHealth, maxHealth)
    }
  }
}

export const SKILLS = {
  HIT_2: createHitSkillObj(2),
  HIT_3: createHitSkillObj(3),
  HIT_4: createHitSkillObj(4),
  HEAL_2: createHealSkillObj(2),
  HEAL_3: createHealSkillObj(3),
  HEAL_4: createHealSkillObj(4)
}

// all of these functions write to newPlayersState
export const HIT_FILTERS = {
  NO_MORE_THAN_2 (oldPlayersState, newPlayersState, playerId) {
    newPlayersState[playerId].health = Math.max(
      oldPlayersState[playerId].health - 2,
      newPlayersState[playerId].health
    )
  },
  NO_DAMAGE_IF_2_OR_LESS (oldPlayersState, newPlayersState, playerId) {
    if (oldPlayersState[playerId].health - newPlayersState[playerId].health <= 2) {
      newPlayersState[playerId].health = oldPlayersState[playerId].health
    }
  },
  RECEIVE_DOUBLE_DAMAGE (oldPlayersState, newPlayersState, playerId) {
    const damageReceived = oldPlayersState[playerId].health - newPlayersState[playerId].health
    newPlayersState[playerId].health = Math.max(
      oldPlayersState[playerId].health - (damageReceived * 2),
      0
    )
  },
}

function createHealBy (amountHealed) {
  return function (newPlayersState, playerId) {
    newPlayersState[playerId].health = Math.min(
      newPlayersState[playerId].health + amountHealed,
      newPlayersState[playerId].maxHealth
    )
  }
}

export const POST_TURN_STEPS = {
  HEAL_BY_1: createHealBy(1),
  HEAL_BY_2: createHealBy(2)
}

export default {
  PROFESSIONS,
  SKILLS,
  HIT_FILTERS,
  POST_TURN_STEPS
}