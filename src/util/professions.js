// health ranges from 10 - 20, depending on power of profession Skill
// hit filter: hits are checked to adjust damage to the player
// turn filter: events that happen after all skills are performed
// different types: tank, assassin, support, special(?)
import _ from 'lodash'

export const PROFESSIONS = _.mapValues({
  TANK_HEALTH: {
    name: 'Tankilicious',
    quote: "ME TANK. YOU HIT.",
    description: `You can't do much, but you have a LOT of health.`,

    type: 'TANK',
    startingHealth: 20,
    possibleSkills: []
  },

  TANK_SELF_HEAL: {
    name: 'Shellfish',
    quote: "Me, myself, and I.",
    description: `You can heal yourself for 2 health.`,

    type: 'TANK',
    startingHealth: 16,
    possibleSkills: ['DO_SELF_HEAL_2']
  },

  TANK_ARMOR: {
    name: 'Duke Devlin',
    quote: 'Ow that barely hurt.',
    description: `Each turn, you cannot received more than 2 damage.`,

    type: 'TANK',
    startingHealth: 12,
    possibleSkills: [],
    hitFilter: 'DAMAGE_MAX_2'
  },

  TANK_SQUISHY: {
    name: 'Jellyfish',
    quote: 'I am squishy.',
    description: `If you receive 2 or less damage in a turn, it's negated.`,

    type: 'TANK',
    startingHealth: 12,
    possibleSkills: [],
    hitFilter: 'DAMAGE_MIN_2',

    minimumNumberOfPlayers: 8
  },

  TANK_AUTO_HEAL: {
    name: 'Groot',
    quote: 'We are Groot.',
    description: `You recover 1 health every turn.`,

    type: 'TANK',
    startingHealth: 14,
    possibleSkills: [],
    postTurnStep: 'HEAL_BY_1'
  },

  TANK_DOUBLE_DAMAGE_HEAL: {
    name: 'Mammoth',
    quote: 'Tis just a flesh wound.',
    description: `You receive double hit damage, but you recover 3 health every turn.`,

    type: 'TANK',
    startingHealth: 20,
    possibleSkills: [],
    hitFilter: 'DAMAGE_RECEIVED_DOUBLE',
    postTurnStep: 'HEAL_BY_3'
  },

  ASSASSIN_NORMAL_LOW: {
    name: 'Ninjamaican me crazy',
    quote: `Ayy, I'm killin' here!`,
    description: `You can hit somebody for 3 damage.`,

    type: 'ASSASSIN',
    startingHealth: 13,
    possibleSkills: ['HIT_3']
  },

  ASSASSIN_NORMAL_HIGH: {
    name: 'Killa',
    quote: `*killing intensifies*`,
    description: `You can hit somebody for 4 damage.`,

    type: 'ASSASSIN',
    startingHealth: 10,
    possibleSkills: ['HIT_4']
  },

  ASSASSIN_HIT_SELF_DAMAGE: {
    name: 'Hidan',
    quote: `Now! Let's savour the utmost of suffering together!`,
    description: `You can hit somebody for 4 damage, but you lose 1 health.`,

    type: 'ASSASSIN',
    startingHealth: 14,
    possibleSkills: ['HIT_SACRIFICE_4']
  },

  SUPPORT_HEAL_NORMAL_LOW: {
    name: 'Rick Astley',
    quote: `We're no strangers to love.`,
    description: `You bring healing with the power of song. You can heal somebody for 2 health.`,

    type: 'SUPPORT',
    startingHealth: 17,
    possibleSkills: ['SUPPORT_HEAL_2']
  },

  SUPPORT_HEAL_NORMAL_MED: {
    name: 'Healaga',
    quote: `I heal, you kill.`,
    description: `You can heal somebody for 3 health.`,

    type: 'SUPPORT',
    startingHealth: 14,
    possibleSkills: ['SUPPORT_HEAL_3']
  },

  SUPPORT_HEAL_NORMAL_HIGH: {
    name: 'Rick Astley - Final Form',
    quote: `NEVER GONNA GIVE YOU UP!`,
    description: `You can heal somebody for 4 health.`,

    type: 'SUPPORT',
    startingHealth: 11,
    possibleSkills: ['SUPPORT_HEAL_4']
  },

  SUPPORT_HEAL_SELF_DAMAGE: {
    name: 'The Giver',
    quote: `No pain, no gain.`,
    description: `You can heal somebody for 4 health, but you lose 1 health.`,

    type: 'SUPPORT',
    startingHealth: 15,
    possibleSkills: ['SUPPORT_HEAL_SACRIFICE_4']
  },

  SPECIAL_WEALTH_HIGH: {
    name: 'Seto Kaiba',
    quote: `Screw the rules, I've got money.`,
    description: `You can gain $20.`,

    type: 'SPECIAL',
    startingHealth: 10,
    possibleSkills: ['DO_GAIN_20']
  },

  SPECIAL_WEALTH_MED: {
    name: 'Snoop Dawg',
    quote: `If the ride is more fly, then you must buy.`,
    description: `You can gain $15.`,

    type: 'SPECIAL',
    startingHealth: 15,
    possibleSkills: ['DO_GAIN_15']
  },

  SPECIAL_WEALTH_REGEN: {
    name: 'Mahk Zuckahbahg',
    quote: `CEO`,
    description: `You passively gain $8 per turn.`,

    type: 'SPECIAL',
    startingHealth: 11,
    possibleSkills: [],
    postTurnStep: 'MONEY_GAINED_8'
  }

  // other possible specials:
  // - if somebody hits a target, the hitter receives 2-3 damage
  // - copy other people's moves
}, (professionObj) => {
  // add the base skills that all professions have
  professionObj.possibleSkills = ['DO_GAIN_7', 'HIT_LOOT', 'HIT_2'].concat(professionObj.possibleSkills)
  return professionObj
})


function createHitSkillObj (hitAmount) {
  return {
    name: 'Hit for ' + hitAmount + ' damage.',
    step: 'HIT',
    type: 'ATTACK',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - hitAmount
    }
  }
}

function createHitSacrificeSkillObj (hitAmount) {
  return {
    name: 'Hit for ' + hitAmount + ' damage, lose ' + (hitAmount - 3) + ' health.',
    step: 'HIT',
    type: 'ATTACK',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - hitAmount
      playersState[player].health = playersState[player].health - (hitAmount - 3)
    }
    // in the future, might have to add a `doSkillSideEffect` step
  }
}

function createHealSkillObj (healAmount) {
  return {
    name: 'Heal for ' + healAmount + ' health.',
    step: 'HEAL',
    type: 'SUPPORT',
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
    name: 'Heal for ' + healAmount + ' health, lose ' + (healAmount - 3) + ' health.',
    step: 'HEAL',
    type: 'SUPPORT',
    doSkill (playersState, payload) {
      const {player, target} = payload
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(playersState[target].health + healAmount, maxHealth)
      playersState[player].health = playersState[player].health - (healAmount - 3)
    }
    // in the future, might have to add a `doSkillSideEffect` step
  }
}

function createGainMoneyObj (moneyAmount) {
  return {
    name: 'Gain $' + moneyAmount + '.',
    step: 'NO_TARGET',
    type: 'INNOCENT',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[player].money = playersState[player].money + moneyAmount
    }
  }
}

export const SKILLS = {
  DO_GAIN_7: {
    name: "Do nothing and gain $7.",
    step: 'NO_TARGET',
    type: 'INNOCENT',
    doSkill (playersState, payload) {
      const {player, target} = payload
      playersState[player].money = playersState[player].money + 7
    }
  },
  HIT_LOOT: {
    name: "Steal $5-$10.",
    step: 'HIT',
    type: 'ATTACK',
    doSkill (playersState, payload) {
      const {player, target} = payload
      const stolenAmount = _.random(5, 10)
      playersState[player].money = playersState[player].money + stolenAmount
      playersState[target].money = playersState[target].money - stolenAmount
    }
  },
  DO_SELF_HEAL_2: {
    name: 'Heal yourself for 2 health',
    step: 'NO_TARGET',
    type: 'INNOCENT',
    doSkill (playersState, payload) {
      const {player, target} = payload
      const maxHealth = playersState[player].maxHealth
      playersState[player].health = Math.min(playersState[player].health + 2, maxHealth)
    }
  },
  HIT_2: createHitSkillObj(2),
  HIT_3: createHitSkillObj(3),
  HIT_4: createHitSkillObj(4),
  SUPPORT_HEAL_2: createHealSkillObj(2),
  SUPPORT_HEAL_3: createHealSkillObj(3),
  SUPPORT_HEAL_4: createHealSkillObj(4),
  HIT_SACRIFICE_4: createHitSacrificeSkillObj(4),
  SUPPORT_HEAL_SACRIFICE_4: createHealSacrificeSkillObj(4),
  DO_GAIN_15: createGainMoneyObj(15),
  DO_GAIN_20: createGainMoneyObj(20)
}

// all of these functions write to newPlayersState
export const HIT_FILTERS = {
  DAMAGE_MAX_2 (oldPlayersState, newPlayersState, playerId) {
    newPlayersState[playerId].health = Math.max(
      oldPlayersState[playerId].health - 2,
      newPlayersState[playerId].health
    )
  },
  DAMAGE_MIN_2 (oldPlayersState, newPlayersState, playerId) {
    if (oldPlayersState[playerId].health - newPlayersState[playerId].health <= 2) {
      newPlayersState[playerId].health = oldPlayersState[playerId].health
    }
  },
  DAMAGE_RECEIVED_DOUBLE (oldPlayersState, newPlayersState, playerId) {
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

function createMoneyGained (moneyGained) {
  return function (newPlayersState, playerId) {
    newPlayersState[playerId].money = newPlayersState[playerId].money + moneyGained
  }
}

export const POST_TURN_STEPS = {
  HEAL_BY_1: createHealBy(1),
  HEAL_BY_3: createHealBy(3),
  MONEY_GAINED_8: createMoneyGained(8)
}

export default {
  PROFESSIONS,
  SKILLS,
  HIT_FILTERS,
  POST_TURN_STEPS
}