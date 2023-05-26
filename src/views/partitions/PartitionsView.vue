<template>
  <div class='container' style="margin-left:150px">
    <div class='row'>
      <div class='col-md-4' v-for='(card, index) in cards' :key='index'>
        <div class='card'>
          <img :src="card.imageUrl" class="card-img-top" alt=".." />
          <div class='card-body'>
            <h5 class='card-title'>{{ card.title }}</h5>
            <p class='card-text'>{{ card.description }}</p>
            <a :href='card.linkUrl' class='btn btn-primary'
            @click="$router.push({ name: 'home', query: { partitions: card.title } })">
            {{ card.linkLabel }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          imageUrl: require('@/assets/image/daily.jpg'),
          title: '日常吐槽',
          description: '言短情长，抒发心声。',
          linkLabel: '跳转分区',
        },
        {
          imageUrl: require('@/assets/image/help.jpg'),
          title: '打听求助',
          description: '疑虑相询，忧难互助。',
          linkLabel: '跳转分区',
        },
        {
          imageUrl: require('@/assets/image/love.jpg'),
          title: '恋爱交友',
          description: '情缘相连，同窗结友。',
          linkLabel: '跳转分区',
        },
        {
          imageUrl: require('@/assets/image/study.jpg'),
          title: '学习交流',
          description: '知识碰撞，学术思辨。',
          linkLabel: '跳转分区',
        },
        {
          imageUrl: require('@/assets/image/secondhand.jpg'),
          title: '二手闲置',
          description: '物尽其用，旧物新归。',
          linkLabel: '跳转分区',
        },
        {
          imageUrl: require('@/assets/image/else.jpg'),
          title: '其他',
          description: '畅所欲言，创意无限。',
          linkLabel: '跳转分区',
        },
      ],
    };
  },
};
</script>

<style scoped>
.container {
  margin-top: 30px;
}

.card {
  margin-bottom: 30px;
}
</style>
