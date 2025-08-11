<script setup>
  import SearchIcon from '@bitrix24/b24icons-vue/outline/SearchIcon';
  import SuccessIcon from '@bitrix24/b24icons-vue/button/SuccessIcon';
  import WarningAlarmIcon from '@bitrix24/b24icons-vue/main/WarningAlarmIcon';

  const toast = useToast()

  function showToast(mode, description) {
    const paramsList = {
      'save-success': {
        title: 'Изменения успешно сохранены!',
        icon: SuccessIcon,
        color: 'success'
      },
      'save-fail': {
        title: 'Не удалось сохранить изменения!',
        icon: WarningAlarmIcon,
        color: 'warning',
        orientation: 'horizontal',
        actions: [{
          label: 'повторить',
          color: 'default',
          onClick: (e) => {
            e?.stopPropagation();
            showToast('save-success');
          }
        }]
      },
      'save-attention': {
        title: 'Невозможно сохранить изменения!',
        icon: WarningAlarmIcon,
        color: 'danger'
      }
    }
    let params = paramsList[mode];
    params['description'] = description;
    toast.add(params);
  }

  const items = [
    {
      label: 'Основное',
      descriptions: 'основные параметры договора',
      slot: 'main'
    },
    {
      label: 'Заказы',
      descriptions: 'информация о связанных заказах',
      slot: 'orders'
    },
    {
      label: 'Операции',
      descriptions: 'информация о финансовых операциях и проводках',
      slot: 'operations'
    }
  ]
</script>

<template>
  <B24App>
    <B24Container>
      <B24Tabs :items="items" class="gap-4 w-full" color="primary" size="xl">
        <template #main="{ item }">
          <B24Alert title="Информация не найдена!" size="sm" color="primary" :icon=SearchIcon />
        </template>
        <template #orders="{ item }">
          <B24Alert title="Информация не найдена!" size="sm" color="primary" :icon=SearchIcon />
        </template>
        <template #operations="{ item }">
          <B24Alert title="Информация не найдена!" size="sm" color="primary" :icon=SearchIcon />
        </template>
      </B24Tabs>
      <B24Container class="save-button-container">
        <B24Button class="save-button" color="primary" @click="showToast('save-fail', 'Сбой подключения к серверу Битрикс24')">Сохранить</B24Button>
      </B24Container>
    </B24Container>
    <NuxtPage />
  </B24App>
</template>

<style>
  .save-button-container {
    text-align: right;
  }
  .save-button {
    margin-top: 4rem;
  }
</style>