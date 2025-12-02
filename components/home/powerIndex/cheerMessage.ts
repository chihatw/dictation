export const getCheerMessage = (days: number) => {
  const cheers = {
    d3_5: ['太棒了！', '好厲害！', '真的很不簡單！'],
    d5_7: ['超有毅力！', '撐住了！最難的就是堅持！', '想為你鼓掌！👏'],
    d7_14: [
      '一週紀念！堅持就是勝利！',
      '一週完成！太感動了！',
      '七天傳說！敬佩！',
    ],
    d14_21: [
      '突破極限！真的很佩服！',
      '你真的在改變自己！',
      '這不是凡人能做到的！',
    ],
    d21_30: ['形成習慣了！了不起！', '這毅力我跪了…', '這才是真正的強者！'],
    d30_50: [
      '30天傳說達成！太感動了！',
      '累積的力量最可怕！',
      '你已經不可阻擋了！🔥',
    ],
    d50_100: ['驚人的堅持！你是模範！', '超越常人！', '這是傳奇的起點！'],
    d100: [
      '百日傳奇！敬佩！！',
      '百日神話誕生！太偉大了！',
      '這是歷史性的一刻！🎉',
    ],
  };

  const randomPick = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  if (days >= 3 && days < 5) return randomPick(cheers.d3_5);
  if (days >= 5 && days < 7) return randomPick(cheers.d5_7);
  if (days >= 7 && days < 14) return randomPick(cheers.d7_14);
  if (days >= 14 && days < 21) return randomPick(cheers.d14_21);
  if (days >= 21 && days < 30) return randomPick(cheers.d21_30);
  if (days >= 30 && days < 50) return randomPick(cheers.d30_50);
  if (days >= 50 && days < 100) return randomPick(cheers.d50_100);
  if (days >= 100) return randomPick(cheers.d100);

  return null;
};
