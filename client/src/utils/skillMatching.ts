/**
 * Utility functions for skill matching between user skills and job requirements
 */

export interface SkillMatch {
  matched: string[];
  missing: string[];
  matchPercentage: number;
  totalRequired: number;
  totalMatched: number;
}

/**
 * Calculate skill match between user skills and job requirements
 * @param userSkills Array of user's skills
 * @param jobSkills Array of job's required skills
 * @returns SkillMatch object with match details
 */
export const calculateSkillMatch = (
  userSkills: string[] = [],
  jobSkills: string[] = []
): SkillMatch => {
  if (!jobSkills || jobSkills.length === 0) {
    return {
      matched: [],
      missing: [],
      matchPercentage: 100, // No skills required, so 100% match
      totalRequired: 0,
      totalMatched: 0,
    };
  }

  // Normalize skills for comparison (lowercase, trim)
  const normalizedUserSkills = userSkills.map((skill) =>
    skill.toLowerCase().trim()
  );
  const normalizedJobSkills = jobSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const matched: string[] = [];
  const missing: string[] = [];

  jobSkills.forEach((jobSkill, index) => {
    const normalizedJobSkill = normalizedJobSkills[index];
    const isMatched = normalizedUserSkills.includes(normalizedJobSkill);

    if (isMatched) {
      matched.push(jobSkill);
    } else {
      missing.push(jobSkill);
    }
  });

  const matchPercentage = Math.round((matched.length / jobSkills.length) * 100);

  return {
    matched,
    missing,
    matchPercentage,
    totalRequired: jobSkills.length,
    totalMatched: matched.length,
  };
};

/**
 * Get skill match color based on percentage
 * @param percentage Match percentage (0-100)
 * @returns CSS classes for color styling
 */
export const getSkillMatchColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600 dark:text-green-400";
  if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
  if (percentage >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

/**
 * Get skill match background color based on percentage
 * @param percentage Match percentage (0-100)
 * @returns CSS classes for background styling
 */
export const getSkillMatchBgColor = (percentage: number): string => {
  if (percentage >= 80)
    return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800";
  if (percentage >= 60)
    return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
  if (percentage >= 40)
    return "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
  return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
};

/**
 * Get skill match message based on percentage
 * @param matchData SkillMatch object
 * @returns Human readable match message
 */
export const getSkillMatchMessage = (matchData: SkillMatch): string => {
  const { matchPercentage, totalRequired, totalMatched } = matchData;

  if (totalRequired === 0) {
    return "No specific skills required";
  }

  if (matchPercentage === 100) {
    return "Perfect match! You have all required skills";
  }

  if (matchPercentage >= 80) {
    return `Excellent match! You have ${totalMatched} of ${totalRequired} required skills`;
  }

  if (matchPercentage >= 60) {
    return `Good match! You have ${totalMatched} of ${totalRequired} required skills`;
  }

  if (matchPercentage >= 40) {
    return `Partial match. You have ${totalMatched} of ${totalRequired} required skills`;
  }

  return `Limited match. You have ${totalMatched} of ${totalRequired} required skills`;
};
