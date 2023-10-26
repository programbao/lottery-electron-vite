const basicData = {
  prizes: [], //奖品信息
  users: [], //所有人员
  luckyUsers: {}, //已中奖人员
  leftUsers: [] //未中奖人员
};
const handleInitUsersData = async (data) => {
  basicData.users = data.users;
  basicData.users_islam = data.users_islam
  basicData.users_christian_catholic = data.users_christian_catholic
  basicData.users_hinduism_buddhism_confucianism = data.users_hinduism_buddhism_confucianism
  // initCards();
  // animate();
  // shineCard();
}