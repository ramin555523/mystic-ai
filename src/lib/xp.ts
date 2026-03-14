import { supabase } from './supabase'
import { LEVELS, STREAK_MULTIPLIERS, XP_ACTIONS } from './constants'

export function getLevelByXP(xp: number) {
  let currentLevel = LEVELS[0]
  for (const level of LEVELS) {
    if (xp >= level.xp) {
      currentLevel = level
    } else {
      break
    }
  }
  return currentLevel
}

export function getNextLevel(xp: number) {
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp < LEVELS[i].xp) {
      return LEVELS[i]
    }
  }
  return null
}

export function getXPProgress(xp: number) {
  const current = getLevelByXP(xp)
  const next = getNextLevel(xp)
  if (!next) return 100
  const levelXP = xp - current.xp
  const neededXP = next.xp - current.xp
  return Math.round((levelXP / neededXP) * 100)
}

export function getStreakMultiplier(streak: number) {
  let multiplier = 1
  for (const s of STREAK_MULTIPLIERS) {
    if (streak >= s.days) {
      multiplier = s.multiplier
    }
  }
  return multiplier
}

export function getStreakBadge(streak: number) {
  let badge = null
  for (const s of STREAK_MULTIPLIERS) {
    if (streak >= s.days) {
      badge = s.badge
    }
  }
  return badge
}

export async function addXP(userId: string, action: keyof typeof XP_ACTIONS) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak')
    .eq('id', userId)
    .single()

  if (!profile) return null

  const multiplier = getStreakMultiplier(profile.streak)
  const baseXP = XP_ACTIONS[action]
  const earnedXP = Math.round(baseXP * multiplier)

  await supabase
    .from('xp_transactions')
    .insert({ user_id: userId, action, xp: earnedXP })

  const newXP = profile.xp + earnedXP
  const newLevel = getLevelByXP(newXP)

  await supabase
    .from('profiles')
    .update({ xp: newXP, level: newLevel.level })
    .eq('id', userId)

  return { earnedXP, newXP, newLevel, multiplier }
}

export async function updateStreak(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak, streak_freeze, last_visit')
    .eq('id', userId)
    .single()

  if (!profile) return null

  const today = new Date().toISOString().split('T')[0]
  const lastVisit = profile.last_visit

  if (lastVisit === today) return profile.streak

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = profile.streak
  let newFreeze = profile.streak_freeze

  if (lastVisit === yesterdayStr) {
    newStreak = profile.streak + 1
  } else if (profile.streak_freeze > 0 && lastVisit) {
    const lastDate = new Date(lastVisit)
    const diffDays = Math.floor(
      (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffDays === 2) {
      newFreeze = profile.streak_freeze - 1
      newStreak = profile.streak + 1
    } else {
      newStreak = 1
    }
  } else {
    newStreak = 1
  }

  await supabase
    .from('profiles')
    .update({
      streak: newStreak,
      streak_freeze: newFreeze,
      last_visit: today,
    })
    .eq('id', userId)

  return newStreak
}