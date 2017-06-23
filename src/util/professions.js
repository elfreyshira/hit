// health ranges from 10 - 20, depending on power of profession Skill
// hit filter: hits are checked to adjust damage to the player
// turn filter: events that happen after all skills are performed
// different types: tank, assassin, support, special(?)

export const PROFESSIONS = {
  TANK_HEALTH: {
    name: 'Tankilicious',
    quote: "ME TANK. YOU HIT.",
    description: `You can't do much, but you have a LOT of health.`,

    type: 'TANK',
    startingHealth: 20,
    possibleSkills: ['HIT_2']
  },

  TANK_ARMOR: {
    name: 'Duke Devlin',
    quote: 'Ow that barely hurt.',
    description: `Each turn, you cannot lose more than 2 health.`,

    type: 'TANK',
    startingHealth: 14,
    possibleSkills: ['HIT_2'],
    hitFilter: 'NO_MORE_THAN_2'
  },

  TANK_SQUISHY: {
    name: 'Jellyfish',
    quote: 'I am squishy.',
    description: `If you receive 2 or less damage in a turn, it's negated.`,

    type: 'TANK',
    startingHealth: 10,
    possibleSkills: ['HIT_2'],
    hitFilter: 'NO_DAMAGE_IF_2_OR_LESS'
  },

  TANK_AUTO_HEAL: {
    name: 'Groot',
    quote: 'We are Groot.',
    description: `You recover 1 health every turn.`,

    type: 'TANK',
    startingHealth: 12,
    possibleSkills: ['HIT_2'],
    postTurnStep: 'HEAL_BY_1'
  },

  TANK_DOUBLE_DAMAGE_HEAL: {
    name: 'Mammoth',
    quote: 'Tis just a flesh wound.',
    description: `You receive double hit damage, but you recover 2 health every turn.`,

    type: 'TANK',
    startingHealth: 20,
    possibleSkills: ['HIT_2'],
    hitFilter: 'RECEIVE_DOUBLE_DAMAGE',
    postTurnStep: 'HEAL_BY_2'
  },

  ASSASSIN_NORMAL_LOW: {
    name: 'Ninjamaican me crazy',
    quote: `Ayy, I'm killin' here!`,
    description: `You can hit somebody for 3 damage.`,

    type: 'ASSASSIN',
    startingHealth: 13,
    possibleSkills: ['HIT_2', 'HIT_3']
  },

  ASSASSIN_NORMAL_HIGH: {
    name: 'Killa',
    quote: `*killing intensifies*`,
    description: `You can hit somebody for 4 damage.`,

    type: 'ASSASSIN',
    startingHealth: 10,
    possibleSkills: ['HIT_2', 'HIT_4']
  },

  ASSASSIN_HIT_SELF_DAMAGE: {
    name: 'Hidan',
    quote: `Now! Let's savour the utmost of suffering together!`,
    description: 'You can hit somebody for between 1-4 damage, but you lose an equal amount of health.',

    type: 'ASSASSIN',
    startingHealth: 20,
    possibleSkills: ['HIT_SACRIFICE_1', 'HIT_SACRIFICE_2','HIT_SACRIFICE_3','HIT_SACRIFICE_4']
  },

  SUPPORT_HEAL_NORMAL_LOW: {
    name: 'Rick Astley',
    quote: `We're no strangers to love.`,
    description: `You bring healing with the power of song. You can heal somebody for 2 health.`,

    type: 'SUPPORT',
    startingHealth: 17,
    possibleSkills: ['HIT_2', 'SUPPORT_HEAL_2']
  },

  SUPPORT_HEAL_NORMAL_MED: {
    name: 'Healaga',
    quote: `I heal, you kill.`,
    description: `You can heal somebody for 3 health.`,

    type: 'SUPPORT',
    startingHealth: 14,
    possibleSkills: ['HIT_2', 'SUPPORT_HEAL_3']
  },

  SUPPORT_HEAL_NORMAL_HIGH: {
    name: 'Rick Astley - Final Form',
    quote: `NEVER GONNA GIVE YOU UP!`,
    description: `You can heal somebody for 4 health.`,

    type: 'SUPPORT',
    startingHealth: 11,
    possibleSkills: ['HIT_2', 'SUPPORT_HEAL_4']
  },

  SUPPORT_HEAL_SELF_DAMAGE: {
    name: 'The Giver',
    quote: `No pain, no gain.`,
    description: `You can heal somebody for between 2-4 health,
      but you lose health equal to one less than what you healed for.`,

    type: 'SUPPORT',
    startingHealth: 20,
    possibleSkills: ['HIT_2', 'SUPPORT_HEAL_SACRIFICE_2','SUPPORT_HEAL_SACRIFICE_3','SUPPORT_HEAL_SACRIFICE_4']
  },
}


function createHitSkillObj (hitAmount) {
  return {
    name: 'Hit for ' + hitAmount + ' damage.',
    type: 'HIT',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - hitAmount
    }
  }
}

function createHitSacrificeSkillObj (hitAmount) {
  return {
    name: 'Hit for ' + hitAmount + ' damage, lose ' + hitAmount + ' health.',
    type: 'HIT',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - hitAmount
      playersState[player].health = playersState[player].health - hitAmount
    }
    // in the future, might have to add a `doSkillSideEffect` step
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

function createHealSacrificeSkillObj (healAmount) {
  return {
    name: 'Heal for ' + healAmount + ' health, lose ' + (healAmount - 1) + ' health.',
    type: 'HEAL',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health + healAmount
      playersState[player].health = playersState[player].health - (healAmount - 1)
    }
    // in the future, might have to add a `doSkillSideEffect` step
  }
}


export const SKILLS = {
  HIT_2: createHitSkillObj(2),
  HIT_3: createHitSkillObj(3),
  HIT_4: createHitSkillObj(4),
  SUPPORT_HEAL_2: createHealSkillObj(2),
  SUPPORT_HEAL_3: createHealSkillObj(3),
  SUPPORT_HEAL_4: createHealSkillObj(4),
  HIT_SACRIFICE_1: createHitSacrificeSkillObj(1),
  HIT_SACRIFICE_2: createHitSacrificeSkillObj(2),
  HIT_SACRIFICE_3: createHitSacrificeSkillObj(3),
  HIT_SACRIFICE_4: createHitSacrificeSkillObj(4),
  SUPPORT_HEAL_SACRIFICE_2: createHealSacrificeSkillObj(2),
  SUPPORT_HEAL_SACRIFICE_3: createHealSacrificeSkillObj(3),
  SUPPORT_HEAL_SACRIFICE_4: createHealSacrificeSkillObj(4)
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
    newPlayersState[playerId].health = oldPlayersState[playerId].health - (damageReceived * 2)
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