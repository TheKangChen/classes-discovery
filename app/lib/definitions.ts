export const LEVELS = ['None', 'Beginner', 'Intermediate', 'Advanced'] as const;
export const FORMATS = ['class', 'workshop', 'lab'] as const;
export const SERIES = [
    '3d modeling', '3d printing', 'ableton live',
    'adobe illustrator', 'adobe indesign', 'adobe photoshop',
    'adobe premiere', 'animation', 'canva',
    'career development', 'civics', 'computer basics',
    'computer hardware', 'css', 'data analysis',
    'data science', 'database', 'digital art',
    'digital learning', 'figma', 'frontend',
    'game development', 'gamemaker', 'garageband',
    'google', 'google docs', 'google sheets',
    'google sites', 'google slides', 'graphic design',
    'html', 'imovie', 'ios development',
    'ipad', 'iphone', 'java',
    'javascript', 'keynote', 'library resource',
    'logic pro', 'mac', 'media production',
    'microsoft excel', 'microsoft office', 'microsoft powerpoint',
    'microsoft word', 'mobile app development', 'music industry',
    'music production', 'music theory', 'numbers',
    'obs', 'office software', 'online services',
    'pages', 'photo editing', 'pixlr',
    'podcast', 'pro tools', 'processing',
    'procreate', 'procreate dreams', 'programming',
    'python', 'reaper', 'social media',
    'soundtrap studio', 'sql', 'studio40',
    'support', 'swift', 'telehealth',
    'tinkercad', 'twine', 'user experience',
    'user interface', 'video editing', 'web development',
    'website builder', 'wordpress'
] as const;

export type Level = typeof LEVELS[number];
export type Format = typeof FORMATS[number];
export type Series = typeof SERIES[number];

export interface ClassResult {
    id: string
    class_title: string
    description: string
    prerequisite: string
    level: Level
    series: Series[]
    format: Format
}
