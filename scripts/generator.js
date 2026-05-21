import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { scrapeTop5 } from './scraper.js';

// Load environment variables
dotenv.config();

const DATA_DIR = path.resolve('src/data');
const CURRENT_FILE = path.join(DATA_DIR, 'current.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Instantiate Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Using mock generation.');
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Get ISO Week Number
function getWeekIdentifier() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

const articleSchema = {
  type: 'OBJECT',
  properties: {
    gameplayHighlights: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: '两个关于该游戏核心玩法与独特魅力的亮点（中文）'
    },
    beginnerHeadache: {
      type: 'STRING',
      description: '新手刚接触这个游戏时最头疼、最容易遇到的一个痛点问题（中文）'
    },
    beginnerSolution: {
      type: 'STRING',
      description: '针对上述新手痛点给出的具体且实用的解决方案或生存建议（中文）'
    },
    endingCTA: {
      type: 'STRING',
      description: '一段简洁有力、语气轻松的结尾，引导读者去查看当前的优惠价格或 Humble Bundle 优惠（中文）'
    },
    summaryArticle: {
      type: 'STRING',
      description: '一篇完整的300字左右的中文游戏攻略短文，融合成熟流畅的段落，包含上述的核心亮点、新手避坑指南和引导折扣结尾（字数必须控制在280-320字之间，中文）'
    }
  },
  required: ['gameplayHighlights', 'beginnerHeadache', 'beginnerSolution', 'endingCTA', 'summaryArticle']
};

async function generateArticle(game) {
  const prompt = `你是一个资深的游戏博主和攻略作家。请为 Steam 热销榜排名第 ${game.rank} 的游戏《${game.title}》（AppID: ${game.appid}）撰写一篇 300 字左右的游戏介绍与新手指南。
要求：
1. 提取并强调该游戏的两个最核心的玩法亮点。
2. 针对新手刚进入游戏时最头疼、最受挫的一个典型问题，给出切实可行的解决方案。
3. 语气要专业、风趣且干货满满。
4. 结尾要极其简洁，引导读者点击购买按钮或查看 Humble Bundle 的折扣和最新优惠。
5. 必须输出符合 Schema 结构的数据。`;

  if (!ai) {
    // Return mock data if API key is missing
    console.log(`Mocking review for ${game.title}...`);
    return {
      gameplayHighlights: [
        `《${game.title}》拥有极具深度的策略性与极高的自由度，玩家可以打造属于自己的独特流派。`,
        `游戏精美的视觉设计与代入感极强的音效，提供了令人沉浸的视听体验。`
      ],
      beginnerHeadache: '新手进入游戏后常常因为资源匮乏、缺乏引导而快速受挫暴毙，不知何去何从。',
      beginnerSolution: '前期应优先跟随主线任务探索以解锁基础工作台，同时集中收集基础木石资源，避免在没有强力装备前进入高等级危险区域。',
      endingCTA: '想要开启这段精彩的冒险吗？赶紧点击下方链接查看当前的 Humble Bundle 史低折扣与最新优惠吧！',
      summaryArticle: `《${game.title}》作为本周热销的明星产品，其最核心的魅力在于极具深度的策略性与极高的流派自由度，玩家能随心所欲定制自己的游玩体验；同时，精致的画面与极佳的打击感也让整场冒险充满沉浸感。不过，许多新人在开荒期常遇到资源极其匮乏、没有引导而在高难区暴毙的窘境。对此，建议新手玩家前期紧跟主线引导，优先制作出基础防具，且多在安全区采集木石累积原始资源，千万不要在装备成型前盲目越级挑战。如果你对这款大作心动已久，现在正是入手的最佳时机！赶紧点击下方按钮查看 Humble Bundle 的最新折扣和超值优惠，祝你游戏愉快！`
    };
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: articleSchema,
      }
    });

    const resultText = response.text;
    return JSON.parse(resultText);
  } catch (error) {
    console.error(`Failed to generate article for ${game.title}:`, error.message);
    throw error;
  }
}

async function run() {
  try {
    const topGames = await scrapeTop5();
    if (topGames.length === 0) {
      throw new Error('No games scraped. Aborting generation.');
    }

    const gamesWithReviews = [];
    for (const game of topGames) {
      console.log(`Generating article for: ${game.title}...`);
      const review = await generateArticle(game);
      gamesWithReviews.push({
        ...game,
        review
      });
      // Small delay to respect rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const weekId = getWeekIdentifier();
    const currentDate = new Date().toISOString().split('T')[0];

    const weeklyData = {
      weekId,
      date: currentDate,
      games: gamesWithReviews
    };

    // Save to current.json
    fs.writeFileSync(CURRENT_FILE, JSON.stringify(weeklyData, null, 2));
    console.log(`Saved current games to: ${CURRENT_FILE}`);

    // Update history.json
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      try {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
      } catch (e) {
        console.error('Failed to parse history.json, resetting history file.');
      }
    }

    // Insert or update week data in history
    const existingIndex = history.findIndex(item => item.weekId === weekId);
    if (existingIndex !== -1) {
      history[existingIndex] = weeklyData;
    } else {
      history.unshift(weeklyData); // Add to the beginning so newest is first
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log(`Saved history data to: ${HISTORY_FILE}`);

  } catch (error) {
    console.error('Workflow error:', error);
    process.exit(1);
  }
}

// Run immediately if executed directly
if (process.argv[1] && process.argv[1].endsWith('generator.js')) {
  run();
}
