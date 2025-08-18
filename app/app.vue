<script setup>
  import { reactive, ref, useTemplateRef, onMounted, nextTick } from 'vue';
  import Inputmask from 'inputmask';
  import * as z from 'zod';
  // import type { FormSubmitEvent } from '@bitrix24/b24ui-nuxt'
  import SearchIcon from '@bitrix24/b24icons-vue/outline/SearchIcon';
  import SuccessIcon from '@bitrix24/b24icons-vue/button/SuccessIcon';
  import WarningAlarmIcon from '@bitrix24/b24icons-vue/main/WarningAlarmIcon';
  import Settings4Icon from '@bitrix24/b24icons-vue/actions/Settings4Icon';
  import CheckIcon from '@bitrix24/b24icons-vue/main/CheckIcon'

  // defineOptions({ inheritAttrs: false });

  const schema = z.object({
    input: z.string().min(10),
    inputNumber: z.number().min(10)
  });

  const sumMin = 0;
  const percentMax = 100;
  const percentStep = 1;
  const sumStep = 1000;
  const isRequired = true;

  // type Schema = z.input<typeof schema>

  const sumOfServices = 654321;
  const prepaidOfServices = 12345;
  const percentOfServices = 0;
  const sumOfProvision = 123456;
  const prepaidOfProvision = 0;
  const percentOfProvision = 0;

  const state = reactive({
    contractNumber: '25-110-137859',
    contractDate: '2025-08-10',
    status: 'проект',
    currency: 'RUB',
    contractType: 'договор-счет',
    template: 'комплексная услуга',
    initiator: 'Котлов Дмитрий',
    isPrepaid: true,
    isMkr: false,
    client: 'ООО "Новые Горизонты"',
    inn: '7814449207',
    contactEmail: 'email@mail.ru',
    isEdo: true,
    signer: 'Директор Котлов Д.В.',
    attorney: ref('по доверенности от 01.02.2025 № 05/2025'),
    sumOfServices,
    prepaidOfServices,
    percentOfServices,
    sumOfProvision,
    prepaidOfProvision,
    percentOfProvision
  });

  calcSumOrPercent(sumOfServices, prepaidOfServices, 'percent', 'services');
  calcSumOrPercent(sumOfProvision, prepaidOfProvision, 'percent', 'provision');

  function calcSumOrPercent(sum, val, mode, field){
    let result = 0;
    if (mode === 'sum'){
      result = (sum * val) / 100;
      if (field === 'services'){
        state.prepaidOfServices = Number(result.toFixed(2));
      } else {
        state.prepaidOfProvision = Number(result.toFixed(2));
      }
    } else {
      result = (val / sum) * 100;
      if (field === 'services'){
        state.percentOfServices = Number(result.toFixed(2));
      } else {
        state.percentOfProvision = Number(result.toFixed(2));
      }
    }
  }

  function formattedValue(val){
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      useGrouping: true
    }).format(val);
}

  const createIsAccess = ref(true);
  const settingsIsActive = ref(false);
  const isPrepaidActive = ref(false);

  const itemsCurrency = ref(['RUB', 'USD', 'EUR', 'CHF', 'CNY', 'CAN', 'GBP', 'JPY', 'INR', 'KRW', 'KZT', 'NOK', 'SGD']);
  const itemsContractType = ref(['договор-счет', 'двусторонний договор', 'доп. соглашение', 'задание к договору']);
  const itemsTemplate = ref(['комплексная услуга', 'агентский договор']);
  const itemsUser = ref(['Котлов Дмитрий', 'Шнайдер Игорь']);
  const itemsClient = ref(['ООО "Новые Горизонты"']);
  const itemsSigner = ref(['Генеральный директор Пушков А.М.', 'Директор Котлов Д.В.', 'Руководитель направления Буянов Д.И.']);
  const attorneysList = {
    'Генеральный директор Пушков А.М.': '',
    'Директор Котлов Д.В.': 'по доверенности от 01.02.2025 № 05/2025',
    'Руководитель направления Буянов Д.И.': 'по доверенности от 21.07.2025 № 08/2025'
  }
  const email = ref('');

  const form = useTemplateRef('form');

  onMounted(() => {
    // if (!window.BX24) {
    //   console.error('BX24 не найден. Подключаем вручную...');
    //   const script = document.createElement('script');
    //   script.src = 'https://api.bitrix24.com/api/v1/';d
    //   script.onload = () => initBX24();
    //   document.head.appendChild(script);
    // } else {
    //   initBX24();
    // }
    // Inputmask({
    //   alias: 'email',
    //   placeholder: ' ',
    //   showMaskOnHover: false
    // }).mask(document.querySelector('input[type="email"]'));
  });

  let entityId;

  function initBX24() {
    BX24.init(() => {
      BX24.ready(function () {
        let context = BX24.placement.info();
        if (context){
          if (context['options']){
            entityId = context['options']['ID'];
          }
        }
        getData();
      });
    });
  }

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
      },
      'error': {
        title: 'Возникла ошибка!',
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

  function getData() {
    if (entityId){
      BX24.callMethod(
        'crm.item.get',
        {
            entityTypeId: 1066,
            id: entityId,
            useOriginalUfNames: 'N',
        },
        (result) => {
          if (result.error()) {
            console.error(result.error());
            showToast('error', result.error());
            return;
          } else {
            console.info(result.data());
          }
        },
      );
    } else {
      showToast('error', 'Не удалось определить ID сущности!');
    }
  }

  // async function saveData(event) {
  //   ;
  //   showToast('save-success');
  //   console.log(event.data, state);
  // }

  async function changeSigner() {
    state.attorney = attorneysList[state.signer];
    console.log(state.attorney);
    console.log(state.signer);
  }

</script>

<template>
  <B24App>
    <B24Container>
      <B24Tabs :items="items" class="gap-3 w-full" color="primary" size="xl">
        <template #main="{ item }">
          <div class="flex flex-col gap-3">
            <B24Container class="flex justify-between p-0 w-full">
              <!-- <div class="flex gap-2"> -->
                <div class="flex justify-start w-1/3">
                  <B24Button class="w-10" color="link" depth="dark" size="sm" @click="settingsIsActive = !settingsIsActive" :icon=Settings4Icon active-color="default" active-depth="light" :active="settingsIsActive"></B24Button>
                </div>
                <!-- <B24Separator orientation="vertical" class="mx-2" /> -->
                 <div class="flex gap-2 w-1/3">
                  <B24Button :color="`${createIsAccess ? 'link' : 'collab'}`" :depth="`${createIsAccess ? 'dark' : 'light'}`" size="sm" @click="" :disabled="createIsAccess">сформировать</B24Button>
                  <B24Button color="link" depth="dark" size="sm" @click="" :disabled="createIsAccess">просмотр</B24Button>
                </div>
              <!-- </div> -->
              <div class="flex justify-end w-1/3">
              <B24Button color="primary" depth="light" size="sm" @click="createIsAccess = !createIsAccess">сохранить</B24Button>
              </div>
            </B24Container>
            <B24Separator class="mb-4"/>
            <div>
              <B24Form
                :state="state"
                class="flex flex-col gap-2 space-y-4"
              >
                <div class="flex flex-row gap-4">
                  <B24FormField
                    label="номер договора"
                    :required="isRequired"
                    class="w-2/12"
                  >
                    <B24Input type="text" v-model="state.contractNumber" />
                  </B24FormField>
                  <B24FormField
                    label="дата договора"
                    :required="isRequired"
                    class="w-2/12"
                  >
                    <B24Input type="date" v-model="state.contractDate" />
                  </B24FormField>
                  <B24FormField
                    label="валюта"
                    :required="isRequired"
                    class="w-2/12"
                  >
                    <B24SelectMenu 
                      type="select" 
                      v-model="state.currency" 
                      class="w-full"
                      :items="itemsCurrency" 
                      :search-input="{
                        placeholder: 'поиск',
                        type: 'search'
                      }"
                    >
                      <template #empty>
                        <div class="custom-empty-text">ничего не найдено</div>
                      </template>
                    </B24SelectMenu>
                  </B24FormField>
                  <B24FormField
                    label="тип договора"
                    :required="isRequired"
                    class="w-3/12"
                  >
                    <B24Select
                      type="select" 
                      v-model="state.contractType" 
                      class="w-full"
                      :items="itemsContractType"
                    />
                  </B24FormField>
                  <B24FormField
                    label="статус"
                    class="w-2/12"
                  >
                    <B24Input v-model="state.status" disabled class="!text-info-link !font-semibold" />
                  </B24FormField>
                </div>
                <div class="flex flex-row gap-4">
                  <B24FormField
                    label="инициатор"
                    :required="isRequired"
                    class="w-4/12"
                  >
                    <B24SelectMenu 
                      type="select" 
                      v-model="state.initiator" 
                      class="w-full"
                      :items="itemsUser" 
                      :search-input="{
                        placeholder: 'поиск',
                        type: 'search'
                      }"
                    >
                      <template #empty>
                        <div class="custom-empty-text">ничего не найдено</div>
                      </template>
                    </B24SelectMenu>
                  </B24FormField>
                  <B24FormField
                    label="контактный e-mail"
                    :required="isRequired"
                    class="w-3/12"
                  >
                    <B24Input type="email" v-model="state.contactEmail" placeholder="example@email.ru" />
                  </B24FormField>
                  <B24Switch
                    :checked-icon="CheckIcon"
                    v-model="state.isPrepaid"
                    label="100% аванс"
                    class="flex items-center mt-[1.5rem]"
                    @change="isPrepaidActive = !isPrepaidActive"
                  />
                  <B24Switch
                    :checked-icon="CheckIcon"
                    v-model="state.isMkr"
                    label="МКР"
                    class="flex items-center mt-[1.5rem]"
                  />
                </div>
                <div class="flex flex-row gap-4">
                  <B24FormField
                    label="заказчик"
                    :required="isRequired"
                    class="w-full"
                  >
                    <B24SelectMenu 
                      type="select" 
                      v-model="state.client" 
                      class="w-full"
                      :items="itemsClient" 
                      :search-input="{
                        placeholder: 'поиск',
                        type: 'search'
                      }"
                    >
                      <template #empty>
                        <div class="custom-empty-text">ничего не найдено</div>
                      </template>
                    </B24SelectMenu>
                  </B24FormField>
                  <B24FormField
                    label="ИНН заказчика"
                    class="w-4/12"
                  >
                    <B24Input v-model="state.inn" disabled class="!text-info-link !font-semibold" />
                  </B24FormField>
                  <B24Switch
                    :checked-icon="CheckIcon"
                    v-model="state.isEdo"
                    label="ЭДО"
                    class="flex items-center mt-[1.5rem]"
                    color="success"
                    disabled
                  />
                </div>
              </B24Form>
            </div>
            <div class="flex flex-col gap-4" v-show="isPrepaidActive">
              <B24Separator label="условия оплаты" class="mt-6 mb-0" />
              <div class="flex flex-row gap-4">
                <div class="mt-[2rem] text-base-800 w-[5rem] text-sm">услуги</div>
                <div class="flex items-end">
                  <B24Separator orientation="vertical" class="h-[2.5rem]" />
                </div>
                <B24FormField
                  label="стоимость услуг"
                  class="w-2/12"
                >
                  <B24Input
                    :modelValue="formattedValue(state.sumOfServices)" 
                    disabled
                  />
                </B24FormField>
                <B24FormField
                  label="сумма аванса"
                  :required="isRequired"
                  class="w-2/12"
                >
                  <B24InputNumber 
                    v-model="state.prepaidOfServices" 
                    :min="sumMin"
                    :max="state.sumOfServices" 
                    :step="sumStep"
                    :format-options="{
                      minimumFractionDigits: 2,
                      useGrouping: true,
                      locale: 'ru-RU'
                    }"
                    notation="standart"
                    orientation="vertical" 
                    @change="calcSumOrPercent(state.sumOfServices, state.prepaidOfServices, 'percent', 'services')"
                    @keyup="(e) => calcSumOrPercent(state.sumOfServices, parseFloat(e.target.value), 'percent', 'services')"
                  />
                </B24FormField>
                <B24FormField
                  label="% от суммы"
                  :required="isRequired"
                  class="w-2/12"
                >
                  <B24InputNumber 
                    v-model="state.percentOfServices" 
                    :min="sumMin"
                    :max="percentMax"
                    :step="percentStep"
                    :format-options="{
                      minimumFractionDigits: 2
                    }" 
                    orientation="vertical"
                    @change="calcSumOrPercent(state.sumOfServices, state.percentOfServices, 'sum', 'services')"
                    @keyup="(e) => calcSumOrPercent(state.sumOfServices, parseFloat(e.target.value), 'sum', 'services')"
                  />
                </B24FormField>
              </div>
              <div class="flex flex-row gap-4">
                <div class="mt-[2rem] text-base-800 w-[5rem] text-sm">обеспечение</div>
                <div class="flex items-end">
                  <B24Separator orientation="vertical" class="h-[2.5rem]" />
                </div>
                <B24FormField
                  label="сумма обеспечения"
                  class="w-2/12"
                >
                  <B24Input 
                    :modelValue="formattedValue(state.sumOfProvision)" 
                    disabled
                  />
                </B24FormField>
                <B24FormField
                  label="сумма аванса"
                  :required="isRequired"
                  class="w-2/12"
                >
                  <B24InputNumber 
                    v-model="state.prepaidOfProvision"
                    :min="sumMin"
                    :max="state.sumOfProvision" 
                    :step="sumStep"
                    :format-options="{
                      minimumFractionDigits: 2,
                      useGrouping: true,
                      locale: 'ru-RU'
                    }" 
                    orientation="vertical" 
                    @change="calcSumOrPercent(state.sumOfProvision, state.prepaidOfProvision, 'percent', 'provision')"
                    @keyup="(e) => calcSumOrPercent(state.sumOfProvision, parseFloat(e.target.value), 'percent', 'provision')"
                  />
                </B24FormField>
                <B24FormField
                  label="% от суммы"
                  :required="isRequired"
                  class="w-2/12"
                >
                  <B24InputNumber 
                    v-model="state.percentOfProvision" 
                    :min="sumMin"
                    :max="percentMax"
                    :step="percentStep"
                    :format-options="{
                      minimumFractionDigits: 2
                    }" 
                    orientation="vertical" 
                    @change="calcSumOrPercent(state.sumOfProvision, state.percentOfProvision, 'sum', 'provision')"
                    @keyup="(e) => calcSumOrPercent(state.sumOfProvision, parseFloat(e.target.value), 'sum', 'provision')"
                  />
                </B24FormField>
              </div>
            </div>
            <div v-show="settingsIsActive">
              <B24Separator label="дополнительные параметры" class="mt-6 mb-4" />
              <div class="flex flex-row gap-4">
                <B24FormField
                  label="шаблон"
                  :required="isRequired"
                  class="w-6/12"
                >
                  <B24Select
                    type="select" 
                    v-model="state.template" 
                    class="w-full"
                    :items="itemsTemplate"
                  />
                </B24FormField>
                <B24FormField
                  label="представитель исполнителя"
                  :required="isRequired"
                  class="w-10/12"
                >
                  <B24Select
                    type="select" 
                    v-model="state.signer" 
                    class="w-full"
                    :items="itemsSigner"
                    @change="changeSigner"
                  />
                </B24FormField>
                <B24Input type="text" v-model="state.attorney" disabled color="success" noBorder noPadding class="mt-[1rem]" custom="info" />
              </div>
            </div>
          </div>
        </template>
        <template #orders="{ item }">
          <B24Alert title="Информация не найдена!" size="sm" color="primary" :icon=SearchIcon />
        </template>
        <template #operations="{ item }">
          <B24Alert title="Информация не найдена!" size="sm" color="primary" :icon=SearchIcon />
        </template>
      </B24Tabs>
    </B24Container>
    <NuxtPage />
  </B24App>
</template>

<!-- showToast('save-fail', 'Сбой подключения к серверу Битрикс24') -->

<style>
  .custom-empty-text {
    cursor: default;
  }
  input[custom="info"]:disabled {
    background: none!important;
    margin-left: -0.5rem!important;
    margin-top: 0.25rem!important;
    color: #7fa800!important;
  }
</style>