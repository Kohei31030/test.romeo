document.addEventListener("DOMContentLoaded", () => {
  // 診断結果タイプと表記の対応リスト
  const testTypeLabels = [
    { type: "socialType", label: "蓮斗代表" },
    { type: "empathyType", label: "裕貴P" },
    { type: "passionType", label: "龍駕主任" },
    { type: "analysisType", label: "春馬D" },
    { type: "adventurousType", label: "瑠衣EP" },
    { type: "ambitionType", label: "流華社長" },
    { type: "resilienceType", label: "騎士CEO" },
    { type: "PogitiveType", label: "やまとFP" },
    { type: "creativeType", label: "たいきFP" },
    { type: "gentleType", label: "優FP" },
  ];

  // 管理者リンクを作成する関数
  function createAdminLinks() {
    const adminLinkList = document.getElementById("admin-link-list");
    testTypeLabels.forEach(({ type, label }) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = `テスト：${label}`;
      link.style.display = "block";
      link.style.margin = "10px 0";
      link.style.color = "blue";
      link.style.textDecoration = "underline";

      // リンククリック時の動作
      link.addEventListener("click", (event) => {
        event.preventDefault(); // デフォルトのリンク動作を無効化
        skipToResult(type); // 該当タイプの診断結果を表示
      });

      listItem.appendChild(link);
      adminLinkList.appendChild(listItem);
    });
  }

  // テスト用：診断結果を直接表示
  function skipToResult(testType) {
    const resultData = personalityResults[testType] || {};

    if (!resultData || !resultData.type) {
      console.error("診断結果データが見つかりませんでした。");
      alert("診断結果データが見つかりませんでした。エラーが発生しました。");
      return;
    }

    const setText = (id, text) => {
      const element = document.getElementById(id);
      if (element) element.textContent = text || "";
    };

    // 診断結果を各HTML要素に反映
    setText("result-type", resultData.type);
    setText("reason-text", resultData.reason);
    setText("strengths-text", resultData.strengths);
    setText("weaknesses-text", resultData.weaknesses);
    setText("compatibility-text", resultData.compatibility);
    setText("approach-text", resultData.approach);

    let resultText = resultData.type;

    // 【】の中身をそのまま h1 タグに変換し、【】を除去
    let resultTypeElement = document.getElementById("result-type");
    resultTypeElement.innerHTML = resultText.replace(/【(.*?)】/g, '<br><h1>$1</h1>');

    // 先輩のアドバイス情報を表示
    const senior = resultData.seniorGreeting || {};
    setText("senior-name-1", senior.name);
    setText("senior-title-1", senior.title);
    setText("senior-profile", senior.profile);
    setText("senior-advice", senior.advice);
    setText("senior-name-2", senior.name);
    setText("senior-title-2", senior.title);

    // 先輩の画像を設定
    const imageElement1 = document.getElementById('senior-irc-1');
    const imageElement2 = document.getElementById('senior-irc-2');
    if (imageElement1 && senior.imageUrl) {
      imageElement1.src = senior.imageUrl;
      imageElement1.style.display = "block"; // 画像を表示
    }
    if (imageElement2 && senior.imageUrl) {
      imageElement2.src = senior.imageUrl;
      imageElement2.style.display = "block"; // 画像を表示
    }
   // 【】を含む部分を取り出して、h3 タグ内に表示
  let match = resultText.match(/【.*?】/);
  if (match) {
    let resultTypeAdviceElement1 = document.getElementById("result-type-advice-1");
    let resultTypeAdviceElement2 = document.getElementById("result-type-advice-2");
    
    // 【】を含む部分をそれぞれに挿入
    resultTypeAdviceElement1.innerHTML = match[0];
    resultTypeAdviceElement2.innerHTML = match[0];
  }
    // 他のページを非表示にし、診断結果ページを表示
    document.getElementById("top-page").style.display = "none";
    document.getElementById("questions").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("result").style.display = "block";
    window.scrollTo(0, 0); // ページの一番上にスクロール
  }

  // 管理者リンクを作成
  createAdminLinks();
});


// 全てのステップを取得
const steps = document.querySelectorAll('.step');

// スクロールイベントを監視
window.addEventListener('scroll', () => {
    steps.forEach(step => {
        const rect = step.getBoundingClientRect(); // 要素の位置を取得
        const windowHeight = window.innerHeight;

        // 要素の50％が画面内に入ったら "active" クラスを追加
        if (rect.top < windowHeight * 0.15 && rect.bottom > windowHeight * 0.15) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
});

      
// 要素がビューポート内に入ったかを監視する関数
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // ビューポート内に入ったら 'visible' クラスを追加
        observer.unobserve(entry.target); // 一度表示した要素の監視を解除
      }
    });
  },
  {
    rootMargin: '0px 0px -15% 0px', // 要素の半分が画面に入った時点で発火
    threshold: 0.15, // 要素が50%見えた時に発火
  }
);

// すべての特典カードを監視
document.querySelectorAll('.feature-item').forEach((item) => {
  observer.observe(item);
});

      // Q&Aアコーディオン
document.querySelectorAll('.qa-item').forEach((item) => {
  item.addEventListener('click', () => {
    // 開閉の切り替え
    item.classList.toggle('open');

    // 他の回答を閉じる（必要なら追加）
    document.querySelectorAll('.qa-item').forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove('open');
      }
    });
  });
});




    // 診断を始めるボタンがクリックされたときに質問セクションを表示  
    document.getElementById("start-quiz-button").addEventListener("click", startQuiz);  


// 現在の質問番号を保持  
let currentQuestion = 0;  

// 質問を表示する関数  
function showQuestion() {  
  const question = questions[currentQuestion];  
  document.getElementById("question-text").textContent = question.question;  
   // ページの一番上にスクロール
    window.scrollTo(0, 0);
  
  // 選択肢をボタンとして表示  
  const answerContainer = document.getElementById("answer-container");  
  answerContainer.innerHTML = ""; // 選択肢のリセット  
  
  question.answers.forEach((answer) => {  
    const button = document.createElement("button");  
    button.textContent = answer.text;  
    button.onclick = () => handleAnswer(answer.score); // 回答のスコアを渡す  
    button.className = "answer-button"; // CSSクラスを追加してスタイリング  
    answerContainer.appendChild(button);  
  });  
  
  // 現在の質問数を更新  
  document.getElementById("progress").textContent = `${currentQuestion + 1} / ${questions.length}`;  
}  
     
// スコアの初期化
let scores = {
  sociability: 0,
  empathy: 0,
  passion: 0,
  analysis: 0,
  creativity: 0
};

// 回答を処理する関数  
function handleAnswer(score) {  
    Object.keys(score).forEach(key => {  
      if (scores.hasOwnProperty(key) && typeof score[key] === 'number') {  
        scores[key] += score[key];  
      }  
    });  

    // チャートのデータを更新
    radarChart.data.datasets[0].data = [
        scores.sociability, 
        scores.empathy, 
        scores.passion, 
        scores.analysis,
        scores.creativity
    ];
    radarChart.update(); // チャートを再描画
    currentQuestion++;  

    currentQuestion < questions.length ? showQuestion() : showResult();
}  

// 診断結果を判定する関数  
function determineResultType() {  
    let maxScore = -Infinity;  // 最も高いスコアを保持
    let bestMatchType = null;   // 最も適した性格タイプを保持
  
    // personalityResults の各タイプに対して
    Object.keys(personalityResults).forEach(type => {
      const typeWeights = personalityResults[type].weights;
      
      // 各スコアとタイプごとの重みを掛け合わせてスコアを計算
      let totalScore = 0;
      totalScore += scores.sociability * typeWeights.sociability;
      totalScore += scores.empathy * typeWeights.empathy;
      totalScore += scores.passion * typeWeights.passion;
      totalScore += scores.analysis * typeWeights.analysis;
      totalScore += scores.creativity * typeWeights.creativity;
  
      // 最も高いスコアを更新
      if (totalScore > maxScore) {
        maxScore = totalScore;
        bestMatchType = type;
      }
    });
  
    return bestMatchType; // 最も一致する性格タイプ
}

// 診断結果を表示する関数
function showResult() {
    // まず「診断中」ページを表示
    document.getElementById("top-page").style.display = "none";
    document.getElementById("questions").style.display = "none";
    document.getElementById("loading").style.display = "block";  // 「診断中」ページを表示
    window.scrollTo(0, 0);  // ページの一番上にスクロール
    
    // 診断後の遷移
    setTimeout(() => {
      const resultType = determineResultType();
      const resultData = personalityResults[resultType] || {};
  
      if (!resultData.type) {
        console.error("診断結果データが見つかりませんでした。");
        alert("診断結果データが見つかりませんでした。エラーが発生しました。");
        return;
      }
  
      const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text || "";
      };
  
      // 診断結果を各HTML要素に反映
      setText("result-type", resultData.type);
      setText("reason-text", resultData.reason);
      setText("strengths-text", resultData.strengths);
      setText("weaknesses-text", resultData.weaknesses);
      setText("compatibility-text", resultData.compatibility);
      setText("approach-text", resultData.approach);
  
      // resultData.type の例: "場を盛り上げ、女性を楽しませることで惚れさせる【陽気なエンターテイナー】タイプ"
      let resultText = resultData.type;
  
      // 【】の中身をそのまま h1 タグに変換し、【】を除去
      let resultTypeElement = document.getElementById("result-type");
      resultTypeElement.innerHTML = resultText.replace(/【(.*?)】/, '<br><h1>$1</h1>');
  
    // 【】を含む部分を取り出して、h3 タグ内に表示
let match = resultText.match(/【.*?】/);
if (match) {
    let resultTypeAdviceElement1 = document.getElementById("result-type-advice-1");
    let resultTypeAdviceElement2 = document.getElementById("result-type-advice-2");
    
    // 【】を含む部分をそれぞれに挿入
    resultTypeAdviceElement1.innerHTML = match[0];
    resultTypeAdviceElement2.innerHTML = match[0];
}

// 先輩のアドバイス情報を表示
const senior = resultData.seniorGreeting || {};
setText("senior-name-1", senior.name);
setText("senior-title-1", senior.title);
setText("senior-profile", senior.profile);
setText("senior-advice", senior.advice);
setText("senior-name-2", senior.name);
setText("senior-title-2", senior.title);

// 先輩の画像を設定
const imageElement1 = document.getElementById('senior-irc-1');
const imageElement2 = document.getElementById('senior-irc-2');
if (imageElement1 && senior.imageUrl) {
    imageElement1.src = senior.imageUrl;
    imageElement1.style.display = "block"; // 画像を表示
}
if (imageElement2 && senior.imageUrl) {
    imageElement2.src = senior.imageUrl;
    imageElement2.style.display = "block"; // 画像を表示
}

// 表示を結果ページに切り替え
document.getElementById("loading").style.display = "none"; // ローディング画面を非表示
document.getElementById("result").style.display = "block"; // 結果ページを表示
  window.scrollTo(0, 0);  // ページの一番上にスクロール
    }, 3000); // 3秒後に結果ページを表示
}




// 診断の開始  
function startQuiz() {  
  document.getElementById("top-page").style.display = "none";  
  document.getElementById("questions").style.display = "block";  
  showQuestion();  
}  
     
         // 質問の配列  
const questions = [  
  {  
    question: "友達の誕生日パーティーで、初対面の人と隣同士になったとき、あなたはどうしますか？",  
    answers: [  
      {  
        text: "自分から積極的に話しかけ、会話を盛り上げる",  
        score: { sociability: 12, empathy: 2, passion: 1, analysis: 0, creativity: 3 }  
      },  
      {  
        text: "相手が話しかけてくるのを待ちつつ、様子を見る",  
        score: { sociability: 8, empathy: 6, passion: 3, analysis: 1, creativity: 2 }  
      },  
      {  
        text: "できるだけ静かにして、他の人と話しているのを見守る",  
        score: { sociability: 3, empathy: 4, passion: 2, analysis: 4, creativity: 1 }  
      }  
    ]  
  },  
  {  
    question: "仕事のイベントで、同僚が困っている様子を見たとき、あなたはどう行動しますか？",  
    answers: [  
      {  
        text: "すぐに声をかけて、問題を解決しようとする",  
        score: { sociability: 10, empathy: 12, passion: 5, analysis: 2, creativity: 4 }  
      },  
      {  
        text: "しばらく様子を見て、必要なタイミングで手を貸す",  
        score: { sociability: 5, empathy: 8, passion: 4, analysis: 5, creativity: 2 }  
      },  
      {  
        text: "他の人が対応しているのを待つ",  
        score: { sociability: 0, empathy: 2, passion: 1, analysis: 8, creativity: 1 }  
      }  
    ]  
  },  
  {  
    question: "あなたの友人が最近落ち込んでいると聞いた時、あなたはどうしますか？",  
    answers: [  
      {  
        text: "すぐに連絡して、気持ちを聞いてあげる",  
        score: { sociability: 10, empathy: 12, passion: 5, analysis: 2, creativity: 4 }  
      },  
      {  
        text: "しばらく様子を見て、タイミングを見計らって声をかける",  
        score: { sociability: 6, empathy: 9, passion: 4, analysis: 5, creativity: 2 }  
      },  
      {  
        text: "何も言わず、そっと見守る",  
        score: { sociability: 0, empathy: 3, passion: 2, analysis: 8, creativity: 1 }  
      }  
    ]  
  },  
  {  
    question: "恋人が疲れているとき、どのようにサポートしますか？",  
    answers: [  
      {  
        text: "すぐに何か手伝うことを提案し、気を使う",  
        score: { sociability: 9, empathy: 12, passion: 6, analysis: 3, creativity: 3 }  
      },  
      {  
        text: "そっとしておき、後で聞いてみる",  
        score: { sociability: 5, empathy: 9, passion: 5, analysis: 6, creativity: 2 }  
      },  
      {  
        text: "自分のことを優先して、後でタイミングを見て話す",  
        score: { sociability: 1, empathy: 5, passion: 2, analysis: 8, creativity: 1 }  
      }  
    ]  
  },  
  {  
    question: "自分が熱中しているプロジェクトに対して、どう取り組みますか？",  
    answers: [  
      {  
        text: "情熱を持って、自分の考えをどんどん周りに伝えて巻き込む",  
        score: { sociability: 7, empathy: 2, passion: 12, analysis: 4, creativity: 10 }  
      },  
      {  
        text: "計画的に取り組み、一歩ずつ進める",  
        score: { sociability: 5, empathy: 6, passion: 6, analysis: 8, creativity: 4 }  
      },  
      {  
        text: "細かい点を気にしすぎて、やる気が削がれてしまうことがある",  
        score: { sociability: 1, empathy: 3, passion: 1, analysis: 12, creativity: 2 }  
      }  
    ]  
  },  
  {  
    question: "あなたが好きなことをしているとき、周りの人が何も言わなくても気になりますか？",  
    answers: [  
      {  
        text: "周囲の反応を気にしながらも、自分のやりたいことを突き進める",  
        score: { sociability: 7, empathy: 4, passion: 12, analysis: 5, creativity: 8 }  
      },  
      {  
        text: "反応が良ければさらに情熱を燃やし、悪ければ少し考え直す",  
        score: { sociability: 5, empathy: 6, passion: 8, analysis: 7, creativity: 5 }  
      },  
      {  
        text: "周りの反応に敏感で、気を使ってしまう",  
        score: { sociability: 1, empathy: 7, passion: 4, analysis: 9, creativity: 2 }  
      }  
    ]  
  },  
  {  
    question: "新しいプロジェクトを始めるとき、最初に何を考えますか？",  
    answers: [  
      {  
        text: "全体の戦略や計画を立て、ステップを細かく分ける",  
        score: { sociability: 1, empathy: 5, passion: 6, analysis: 12, creativity: 4 }  
      },  
      {  
        text: "とりあえず始めて、途中で調整しながら進める",  
        score: { sociability: 5, empathy: 6, passion: 8, analysis: 7, creativity: 6 }  
      },  
      {  
        text: "直感で進めるが、途中で不安になったら立ち止まって考える",  
        score: { sociability: 4, empathy: 3, passion: 5, analysis: 9, creativity: 8 }  
      }  
    ]  
  },  
  {  
    question: "デートで相手が少し不安そうにしているとき、あなたはどう反応しますか？",  
    answers: [  
      {  
        text: "相手の言動をよく観察し、何が原因かを考えながら気づかいをする",  
        score: { sociability: 8, empathy: 12, passion: 5, analysis: 6, creativity: 5 }  
      },  
      {  
        text: "とりあえず話をして、何となく雰囲気を和らげようとする",  
        score: { sociability: 6, empathy: 10, passion: 7, analysis: 7, creativity: 4 }  
      },  
      {  
        text: "相手に気を使い過ぎて、逆に自分が不安になってしまう",  
        score: { sociability: 2, empathy: 8, passion: 3, analysis: 9, creativity: 3 }  
      }  
    ]  
  },  
  {  
    question: "大事な約束をしたけど、急に予定が入ってしまったとき、どうしますか？",  
    answers: [  
      {  
        text: "約束を守るために、何とかして調整し、必ず守る",  
        score: { sociability: 8, empathy: 5, passion: 6, analysis: 4, creativity: 2 }  
      },  
      {  
        text: "約束を守るためにできる限り努力し、無理なら事前に知らせる",  
        score: { sociability: 7, empathy: 8, passion: 5, analysis: 6, creativity: 3 }  
      },  
      {  
        text: "相手の都合を考えずに、自分の予定を優先する",  
        score: { sociability: 3, empathy: 1, passion: 2, analysis: 8, creativity: 1 }  
      }  
    ]  
  },  
  {  
  question: "チームでの仕事で、自分が間違えたとき、あなたはどう行動しますか？",  
  answers: [  
    {  
      text: "自分のミスを認め、素直に謝って改善策を考える",  
      score: { sociability: 6, empathy: 9, passion: 4, analysis: 6, creativity: 7 }  
    },  
    {  
      text: "チームのサポートを求めて、問題解決に取り組む",  
      score: { sociability: 5, empathy: 6, passion: 7, analysis: 8, creativity: 6 }  
    },  
    {  
      text: "他のメンバーに任せて、できるだけ目立たないようにする",  
      score: { sociability: 0, empathy: 2, passion: 1, analysis: 12, creativity: 3 }  
    }  
  ]  
}
];



// 各性格タイプごとの診断結果データ  
const personalityResults = {  
  socialType: {  
    weights: { sociability: 9, empathy: 6, passion: 5, analysis: 2, creativity: 3 },
    type: "場を盛り上げ、女性を楽しませることで惚れさせる【エンターテイナー系ホスト】",
    reason: "あなたは社交的な場面で特に力を発揮します。人々の前で話すことに慣れており、周囲の空気を読んで適切なタイミングで会話を始めたり、盛り上げたりすることが得意です。そのため、周りの人がリラックスして楽しい時間を過ごせるようにする能力があります。あなたの存在が、場を和ませるカギとなっています。",
strengths: "あなたのコミュニケーション能力は非常に高いです。相手の気持ちを素早く察知し、適切な言葉を選んで伝えることができます。また、どんな環境でもすぐに溶け込める適応力があり、初対面の人とも打ち解けることができます。こうしたスキルは、ホストとしても大いに役立つ強みです。",
weaknesses: "時には話しすぎてしまうことがあります。会話に夢中になりすぎて、相手の意見や反応を見逃すことがあるかもしれません。相手にも話す機会を与えるよう意識することで、よりバランスの取れたコミュニケーションが可能になります。",
compatibility: "穏やかで落ち着きのあるタイプの人との相性が良いです。あなたが元気で社交的な性格を持っている一方で、落ち着いている人と一緒にいると、バランスが取れて心地よい関係を築けます。お互いの特徴を補完し合い、自然に心地よい空間が生まれます。",
approach: "デートの際は、気軽なカフェデートを提案して、リラックスした雰囲気で接することをおすすめします。例えば、静かなカフェで美味しいコーヒーを飲みながら、軽い会話を楽しんでください。無理なく会話が進み、お互いにリラックスできる環境が作れます。『このカフェ、すごく雰囲気いいんだ。リラックスできるから、ぜひ一緒に行こう』と誘うことで、自然な流れでデートが楽しめます。",

    seniorGreeting: {  
      name: "蓮斗",  
      title: "代表", 
      imageUrl: "https://www.host2.jp/shop/romeo_1/rento/pr01.jpg",
      "profile": "月間売上2300万over、指名本数110本over。明るく社交的でエネルギーに満ちた代表。人懐っこく、誰とでもすぐに打ち解けることができる。周囲を元気にし、自然な魅力で皆を惹きつける。",
      "advice": "君の明るさは非常に魅力的だよ。そのエネルギッシュな性格を活かして、どんな状況でも前向きな雰囲気を作り出せる。自分らしくいることが大切だよ。自信を持って、君の自然体で接することで、お客様との信頼を築けるし、何度でも会いたくなるホストになれるはずだ！",
    }  
  },  
  empathyType: {  
    weights: { sociability: 3, empathy: 9, passion: 4, analysis: 4, creativity: 6 },
    type: "優しさで包み込み、安心感を与えて好きにさせる【癒し系ホスト】",
    reason: "相手の気持ちを察して配慮することが得意なあなたは、誰からも信頼されやすい存在です。質問の選択肢からも、他者に対する思いやりが感じられ、相手のニーズを優先する傾向が伺えます。",
    strengths: "優れた共感力で、相手の気持ちを汲み取ることが得意です。自然と相手を安心させ、信頼を築くことができます。",
    weaknesses: "相手に合わせすぎて、自分の意見を伝えられないことがあります。自分の考えも大切にし、適度に伝えることを心掛けましょう。具体的には、相手の意見に同意した上で、自分の意見も少しずつシェアしてみると良いでしょう。",
    compatibility: "ポジティブで引っ張ってくれるタイプの女性が相性が良いです。あなたの優しさと相手の積極性で、バランスの取れた関係が築けます。",
    approach: "穏やかなデートプランを提案し、例えば美味しいスイーツが楽しめるカフェで、ゆっくりとした時間を共有すると良いです。『一緒に美味しいスイーツを食べに行かない？』と誘えば、リラックスした雰囲気でデートが楽しめます。",
    seniorGreeting: {  
      name: "裕貴",  
      title: "Producer",  
      imageUrl: "https://www.host2.jp/shop/romeo_1/yuki/pr01.jpg",
      profile: "年間売上1億over、年間指名本数120本over。誰に対しても優しく思いやりを持ち、お客様の気持ちに寄り添うホスト。繊細で、丁寧な接客で信頼を集める。",
      advice: "君の共感力は、女性に安心感を与え、心からリラックスさせる力がある。その優しさはホストクラブでも大切にされるスキルだよ。相手の気持ちに寄り添えるホストは、お客様の信頼を得やすいし、何度も会いたくなる存在になれる。迷っているなら、君の優しさをここで活かしてみないか？きっと多くの人に求められる存在になれるはずだ！",
    }  
  },  
    passionType: {  
      weights: { sociability: 5, empathy: 6, passion: 9, analysis: 2, creativity: 3 },
  type: "情熱的なアプローチで女性を夢中にさせる【熱血系ホスト】",
  reason: "目的達成のためにエネルギッシュに行動するあなたは、周囲を引っ張るリーダーシップも備えています。質問の選択肢からも、目標志向が強く、情熱的な姿勢が感じられます。",
  strengths: "目標に向かってブレずに行動し、強い意志を持って突き進むことが得意です。周囲を引っ張るリーダーシップもあり、自然と多くの人にインスピレーションを与える存在です。",
  weaknesses: "自分の意見を押し通しすぎてしまい、他人の意見を軽視しがちです。相手の話を聞くことを意識すると良いです。具体的には、誰かの意見に一旦肯定のリアクションをすることで、お互いがリラックスできる関係を築きやすくなります。",
  compatibility: "穏やかで聞き上手なタイプの女性が相性抜群です。あなたの情熱に安心感をもたらし、自然と落ち着いた関係が築けます。",
  approach: "アクティブなデートを提案し、例えば一緒にスポーツ観戦やアウトドアのアクティビティを楽しむのがオススメです。『今度一緒にスポーツ観戦とかどう？きっと楽しめると思うんだ！』と、エネルギッシュな誘い方をすると良いでしょう。",
  seniorGreeting: {  
    name: "龍駕",  
    title: "主任",  
    imageUrl: "https://www.host2.jp/shop/romeo_1/ryuga/pr01.jpg",
    profile: "未経験で初めて1年で月間1000万を達成。目標に向かって情熱的に取り組み、多くの人を鼓舞するホスト。負けず嫌いな性格で、お客様の夢や目標に対しても熱心にサポートする。",
    advice: "君の情熱は、女性を魅了する大きなエネルギーだ。自分の想いを真っ直ぐに伝えられる力は、ホストクラブでも多くの人を引きつけ、刺激的な時間を提供するために役立つ。迷っているなら、その情熱をここで発揮してみないか？一歩踏み出せば、君のエネルギーが誰かの心を動かす大きな力になる！",
  }  
},  
analysisType: { 
  weights: { sociability: 2, empathy: 4, passion: 3, analysis: 9, creativity: 7 },
  type: "冷静な判断で頼りがいを示し、信頼を得て惚れさせる【戦略型ホスト】",
  reason: "冷静で論理的な視点を持ち、物事を客観的に捉えるあなたは、どんな状況でも的確に対応できる能力を持っています。質問の選択肢からも、問題解決や計画性を重視する姿勢が見受けられます。",
  strengths: "状況を的確に判断し、最適な解決策を見出すことが得意です。冷静な分析力で物事を進められるため、周囲から頼られる存在になることが多いでしょう。",
  weaknesses: "感情表現が控えめで、冷たく見られてしまうことがあります。感情を表現することを意識すると、親しみやすさが増します。相手の話に共感の言葉やリアクションを交えることで、柔らかな印象が与えられるでしょう。",
  compatibility: "感情豊かで明るいタイプの女性が相性が良いです。あなたの冷静さが相手に安心感を与え、相手の明るさがあなたにリラックスした時間をもたらしてくれます。",
  approach: "少し知的なデートを提案し、美術館や博物館に行った後にカフェで感想を語り合うと良いです。『一緒にこの展示を見て、感想を話し合えたら面白そうだね』と誘うと親近感が高まります。",
  seniorGreeting: {  
    name: "春馬",  
    title: "Director",  
    imageUrl: "https://www.host2.jp/shop/romeo_1/haruma/pr01.jpg",
    profile: "月間売上1300万over、指名本数120本over。冷静沈着な分析力で信頼を勝ち取るディレクター。常にお客様の悩みや要望を深く理解し、最適なアドバイスを提供する。",
    advice: "君の冷静な分析力は、女性に安心感を与え、頼れる存在となる。それはホストクラブでも、様々な状況に柔軟に対応できるスキルとして重宝される。計画的に物事を進める君だからこそ、多くの信頼を得られる。迷っているなら、その頼れる力をここで発揮してみないか？必ず信頼されるホストとして成長できるはずだ！",
  }  
},  
  
  creativeType: {
    weights: { sociability: 3, empathy: 5, passion: 4, analysis: 3, creativity: 9 },
    type: "ユニークな発想と創造力で女性を惹きつける【クリエイティブホスト】",
    reason: "あなたは独自の視点を持ち、常に新しいアイデアを生み出すことが得意です。その創造力で、相手を驚かせたり感動させたりする能力を持っています。",
    strengths: "新しいことに挑戦し、常に相手を楽しませる方法を見つけ出す力があります。柔軟な発想で、多様な状況に対応できる点も魅力的です。",
    weaknesses: "発想に集中しすぎて、現実的な側面を見落とすことがあります。相手の反応や状況を見て、計画性を持つことが大切です。",
    compatibility: "実務的で落ち着きのある女性との相性が良いです。あなたの創造力を補完し、安定感のある関係を築けます。",
    approach: "クリエイティブな活動を取り入れたデートを提案すると良いです。例えばアートワークショップやDIY体験に誘うと、二人で楽しめる時間が作れます。",
    seniorGreeting: {
      name: "たいき",
      title: "Future Player",
      imageUrl: "https://www.host2.jp/shop/romeo_1/taiki/pr01.jpg",
      profile: "常に新しいアイデアでお客様を驚かせる柔軟な発想力の持ち主。創造力を武器に、独自の接客スタイルを確立している。",
      advice: "君のアイデアは人を魅了する力がある。ホストとしても、斬新な方法でお客様を楽しませることができるだろう。その想像力を思い切り発揮して、新しい価値を提供しよう！"
    }
  },
  adventurousType: {
    weights: { sociability: 6, empathy: 5, passion: 8, analysis: 4, creativity: 7 },
    type: "刺激的な発想で女性を引き込む【改革思考型ホスト】",
    reason: "あなたは挑戦を恐れず、新しい体験を求める性格です。刺激的でダイナミックなアプローチが得意で、相手に忘れられない思い出を提供します。",
    strengths: "エネルギッシュで行動力にあふれており、どんな状況でもリードできる点が強みです。",
    weaknesses: "時には冒険的すぎて、相手にプレッシャーを与えることがあります。相手の気持ちを考慮してペースを調整しましょう。",
    compatibility: "落ち着きがあり、安定を好む女性が相性抜群です。あなたの冒険心を支え、良いバランスを作り出します。",
    approach: "大胆なプランを提案しつつ、相手の興味を引き出すことを意識してください。『このアクティビティ一緒にやってみよう！』と誘うと良いでしょう。",
    seniorGreeting: {
      name: "瑠衣",
      title: "Exrcutive Player",
      imageUrl: "https://www.host2.jp/shop/romeo_1/rui/pr01.jpg",
      profile: "未経験から業界入りし、常に新しい挑戦を続けている。エネルギーと情熱でお客様を楽しませるリーダー的存在。",
      advice: "その冒険心は、女性を刺激し、新しい世界を見せる大きな力だよ。ホストクラブでも、君のようなチャレンジャーは求められている。挑戦することを恐れずに、思い切って進んでみよう！"
    }
  },
  ambitionType: {
    weights: { sociability: 4, empathy: 3, passion: 9, analysis: 6, creativity: 7 },
    type: "高い目標を掲げ、自己成長で女性を惹きつける【成長志向型ホスト】",
    reason: "あなたは、常に目標を追い求め、自己成長に励む姿勢を持っています。質問の選択肢からも、自分を高めることに喜びを感じ、努力を惜しまない一面が見受けられます。",
    strengths: "自分の目標に向かって努力を続けられる持続力と、それを周囲に共有し、刺激を与える能力があなたの強みです。",
    weaknesses: "時に自分の成功に夢中になりすぎて、周囲を気遣う余裕を失うことがあります。相手の気持ちに目を向けることで、より円滑な関係が築けるでしょう。",
    compatibility: "共感力が高く、あなたを応援してくれるタイプの女性と相性が良いです。お互いにポジティブなエネルギーを共有できる関係が築けます。",
    approach: "新しい挑戦をテーマにしたデートプランを提案し、例えば新しい料理を学ぶ料理教室や趣味を深めるイベントに一緒に参加すると良いです。『こんな体験、一緒にやってみない？』と誘うと、自然な流れで共通の目標を持てるデートが楽しめます。",
    seniorGreeting: {
      name: "流華",
      title: "社長",
      imageUrl: "https://www.host2.jp/shop/romeo_1/ruka/pr01.jpg",
      profile: "自身の向上心で店舗の売上を牽引し、スタッフからの信頼も厚いリーダー。目標を追い続ける情熱と冷静な判断力を併せ持つ。",
      advice: "君の向上心は、女性に刺激を与え、未来への期待感をもたらす力がある。その特性を活かして、夢を語り、成長していく姿を見せれば、自然と魅力が増す。君の持つ可能性を信じて挑戦してみないか？この場所なら、その向上心を最大限に活かせるはずだ！"
    }
  },
  resilienceType: {
    weights: { sociability: 5, empathy: 7, passion: 6, analysis: 9, creativity: 4 },
    type: "逆境を乗り越え、頼もしさで女性を惚れさせる【チャレンジャー型ホスト】",
    reason: "困難な状況でもあきらめずに行動できるあなたは、強い精神力と忍耐力を持っています。質問の選択肢からも、逆境に立ち向かう力強さとポジティブさが感じられます。",
    strengths: "逆境に立ち向かう精神力と、常に前向きに物事を捉える思考があなたの最大の強みです。周囲に安心感と信頼を与える存在になれるでしょう。",
    weaknesses: "辛抱強さが故に、自分だけで問題を抱え込みすぎることがあります。周囲に相談することで、より良い解決策が見つかるでしょう。",
    compatibility: "穏やかで癒しを提供してくれるタイプの女性が相性抜群です。お互いに支え合うバランスの良い関係が築けます。",
    approach: "アウトドアやアクティブなデートを提案し、例えば一緒にハイキングやボルダリングなどに挑戦するのがおすすめです。『一緒にチャレンジしてみない？』と積極的に誘うと、前向きな印象を与えられます。",
    seniorGreeting: {
      name: "騎士",
      title: "CEO",
      imageUrl: "https://www.host2.jp/shop/romeo_1/knight/pr01.jpg",
      profile: "業界を牽引するトップリーダーとして、常に新しい挑戦を続ける姿勢が多くの人に影響を与える。逆境を跳ね返す力強さと冷静な判断力で、信頼を集める存在。",
      advice: "君の粘り強さと挑戦する姿勢は、多くの人に希望を与える力がある。ホストとしてもその特性を活かし、お客様に頼られる存在になれるはずだ。君ならどんな困難も乗り越えられると信じている！"
    }
  },
  
PogitiveType: {
  weights: { sociability: 7, empathy: 8, passion: 6, analysis: 4, creativity: 6 },
  type: "未来を切り開く行動力で女性を引きつける【ポジティブ系ホスト】",
  reason: "常にポジティブに未来を見据え、挑戦を恐れず進むあなたは、目標に向かって着実に成長しているタイプです。困難を前向きに捉え、自己成長を信じて邁進しています。",
  strengths: "行動力に満ち、計画的に目標達成を目指します。未来に対する希望を持ち、周囲を巻き込みながら積極的に進んでいく力があります。",
  weaknesses: "時には前向き過ぎて、計画に集中し過ぎてしまうことがあります。バランスを取ることも大切ですが、リスクを取って飛躍することで更なる成長を遂げられるでしょう。",
  compatibility: "共に成長し、前向きに未来を切り開いていける相手が相性が良いです。お互いの希望や夢を共有し、前向きなエネルギーで支え合う関係を築けます。",
  approach: "デートでは、未来に向けた前向きな目標や夢をシェアし合いましょう。『この先の人生で何を成し遂げたい？』という質問でお互いを深く知ることが、より強い絆を生み出します。",
  seniorGreeting: {
    name: "やまと",
    title: "Future Player",
    imageUrl: "https://www.host2.jp/shop/romeo_1/yamato/pr01.jpg",
    profile: "目標に向かって着実に成長し続けるホスト。未来を見据えて行動し、周囲を元気づける存在。",
    advice: "未来を見据えてポジティブに行動することは本当に大事だよ。君の前向きな姿勢は周りに良い影響を与えるし、もっと冒険して、リスクを取ることで、更に大きな成功をつかめるよ！"
  }
},
gentleType: {
  weights: { sociability: 6, empathy: 9, passion: 5, analysis: 3, creativity: 5 },
  type: "優しさと柔軟な思考で女性を引きつける【紳士系ホスト】",
  reason: "繊細で思いやりのあるあなたは、未来に向けた柔軟な思考を持っています。お客様の気持ちに寄り添いながら、自分自身も成長していこうとする姿勢が特徴です。",
  strengths: "周囲に対して優しく、細かい気配りができるため、信頼を得やすいです。常に周囲とのバランスを大切にし、自己成長にも意識を向けています。",
  weaknesses: "時に自分の意見を控えめにしてしまうことがあり、自己主張が不足することがあります。自分の考えも大切にし、周りと意見交換をすると良いでしょう。",
  compatibility: "落ち着いていて、優しさを持った相手との相性が良いです。お互いの価値観を尊重し、自然に支え合える関係が築けます。",
  approach: "穏やかなデートプランを提案し、お互いにリラックスできる場所で過ごすのがオススメです。『今度一緒に穏やかなカフェでリラックスしようよ』という誘い方が効果的です。",
  seniorGreeting: {
    name: "優",
    title: "Future Player",
    imageUrl: "https://www.host2.jp/shop/romeo_1/yu/pr01.jpg",
    profile: "優れた共感力を持つホスト。細やかな気配りで信頼を得ると同時に、自己成長にも力を入れている。",
    advice: "君の優しさは素晴らしい武器だよ。その柔軟な思考でお客様に寄り添っていくことで、確実に成長していくはず。自分の意見を少しずつ表現していくことで、もっと広がりを見せていけるよ！"
  }
}

}

// SNSシェア機能（X専用）
function shareToX() {  
  const url = encodeURIComponent(window.location.href); // 現在のページURLをエンコード

  // "result-type"要素から診断結果を取得
  const resultElement = document.getElementById("result-type");
  const result = resultElement ? resultElement.textContent.trim() : "診断結果が見つかりません";

  // シェア用のテキストを作成
  const text = encodeURIComponent(`あなたの診断結果は「${result}」です！ #ロミオモテ男診断`);

  // シェア用URLを生成
  const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;

  // 新しいウィンドウでシェアURLを開く
  window.open(shareUrl, "_blank", "noopener,noreferrer");
}


// 最初に質問を表示  
function startQuiz() {  
  document.getElementById("top-page").style.display = "none";  
  document.getElementById("questions").style.display = "block";  
  showQuestion();  
}  

     
      
       
// 要素の取得
const hamburger = document.getElementById('hamburger');
const navBar = document.querySelector('.nav-bar');
const overlay = document.getElementById('overlay');

// メニューの表示/非表示を切り替える関数
function toggleMenu() {
  hamburger.classList.toggle('active');
  navBar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// ハンバーガーメニューとオーバーレイのクリックイベント
hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navBar.classList.remove('active');
  overlay.classList.remove('active');
});


      
      

        // カウントダウンタイマーのスクリプト
        const updateCountdown = () => {
    const deadline = new Date("2024-12-31T23:59:59").getTime();
    const now = new Date().getTime();
    const timeLeft = deadline - now;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      document.querySelector('.timer').style.display = 'none';
      document.getElementById('expired-message').style.display = 'block';
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
  };

  const timerInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
    
    
  
// レーダーチャートのデータ
const data = {
  labels: ['社交性', '共感性', '情熱', '分析力','創造性'],
  datasets: [{
    data: [scores.sociability, scores.empathy, scores.passion, scores.analysis, scores.creativity],
    label: 'あなたの診断結果',
    backgroundColor: 'rgba(255, 182, 193, 0.3)',  // 可愛らしいパステルピンク
    borderColor: 'rgba(255, 105, 180, 1)',  // 可愛らしいピンクの線
    borderWidth: 1
  }]
};

// レーダーチャートのオプション
const options = {
  responsive: true,
  scales: {
    r: {
      min: 0,
      max: 100,  // スコアの最大値
      ticks: {
        stepSize: 20,  // スコア間の刻み
        display: false  // 目盛りを非表示にして、よりシンプルに
      },
      grid: {
        color: 'rgba(255, 105, 180, 0.2)',  // グリッド線を淡いピンクに変更
        lineWidth: 5,  // グリッド線を細く
        borderDash: [5, 5]  // 点線にして、柔らかい印象を与える
      }
    }
  },
  elements: {
    line: {
      borderWidth: 8,  // 線の太さ
      borderColor: 'rgba(255, 105, 180, 1)', // 可愛いピンク色
      fill: 'start', // チャートの塗りつぶし
      // シャドウ効果の追加
      shadowOffsetX: 5, 
      shadowOffsetY: 5,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.25)', // シャドウの色
    },
    point: {
      backgroundColor: 'rgba(255, 105, 180, 1)', // ポイントの色をピンクに
      radius: 8, // ポイントのサイズを少し大きく
      // シャドウ効果の追加
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      shadowBlur: 5,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    }
  },
  animation: {
    duration: 1000,  // アニメーションの時間
    easing: 'easeOutBounce', // アニメーションのイージング効果
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: 'Arial',  // フォントをArialに設定
          size: 18,  // ラベルのフォントサイズを大きく
          color: '#555',  // ラベルの文字色を少し優しく
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 105, 180, 0.8)', // ツールチップの背景色を優しいピンクに
      titleColor: '#fff',  // ツールチップタイトルの色
      bodyColor: '#fff',   // ツールチップ内容の色
      padding: 10,
      cornerRadius: 5,  // ツールチップの角を丸める
      bodyFont: {
        family: 'Arial',  // ツールチップのフォントをArialに
        size: 18,  // フォントサイズを少し大きく
      }
    }
  }
};

// レーダーチャートを描画
const ctx = document.getElementById('radar-chart').getContext('2d');
const radarChart = new Chart(ctx, {
  type: 'radar',
  data: data,
  options: options
});
