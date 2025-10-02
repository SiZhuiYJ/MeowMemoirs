<script setup lang="ts">
  import { ref,
    onMounted } from "vue";
  import { useAccessStore } from "@/stores";
  const ip = ref('');
  const accessStore = useAccessStore();
  const { queryLocation } = useAccessStore();
  // ip查询
  const handleQueryLocation = async () => {
    try {
      await queryLocation(ip.value);
    } catch (error) {
      console.log(error);
    }
  };
  onMounted(() => {
    ip.value = accessStore.getSimpleIP?.ip || '';
  });
</script>
<template>
  <div class="main-content">
    <div class="ip-info-container">
      <div class="ip-info-card">
        <h3 class="ip-info-title">IP 信息详情</h3>
        <div class="ip-info-table">
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">IP地址</span>
              <span class="cell-value">
                <el-input v-model="ip" style="max-width: 600px" placeholder="Please input"
                  class="input-with-select">
                  <template #append>
                    <el-button icon="Search" @click="handleQueryLocation()" />
                  </template>
                </el-input></span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">AS编号</span>
              <span class="cell-value">{{ accessStore.getSimpleIP?.as?.number || '未知' }}</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">AS名称</span>
              <span class="cell-value">{{ accessStore.getSimpleIP?.as?.name || '未知' }}</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">运营商</span>
              <span class="cell-value">{{ accessStore.getSimpleIP?.as?.info || '未知' }}</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">地址段</span>
              <span class="cell-value">{{ accessStore.getSimpleIP?.addr || '未知' }}</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">国家</span>
              <span class="cell-value">{{ accessStore.getSimpleIP?.country?.name || '未知' }} ({{
                accessStore.getSimpleIP?.country?.code || '未知' }})</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">注册国家</span>
              <span class="cell-value">{{ accessStore.getSimpleIP?.registeredCountry?.name || '未知' }} ({{
                accessStore.getSimpleIP?.registeredCountry?.code || '未知' }})</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">地区</span>
              <span class="cell-value">{{ (accessStore.getSimpleIP?.regions || []).join(' / ') || '未知'
                }}</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">地区简称</span>
              <span class="cell-value">{{ (accessStore.getSimpleIP?.regionsShort || []).join(' / ') ||
                '未知'
                }}</span>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              <span class="cell-label">连接类型</span>
              <span class="cell-value">{{ accessStore.getSimpleIP?.type || '未知' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .ip-info-container {
    height: calc(100% - 40px);
    display: flex;
    justify-content: center;
  }

  .ip-info-card {
    width: 100%;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e1e8ed;
  }

  .ip-info-title {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin: 0;
    padding: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .ip-info-table {
    padding: 0;
  }

  .table-row {
    display: flex;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f8f9fa;
    }
  }

  .table-cell {
    display: flex;
    width: 100%;
    padding: 12px 20px;
  }

  .cell-label {
    flex: 0 0 150px;
    font-weight: 600;
    color: #495057;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .cell-value {
    flex: 1;
    color: #212529;
    font-size: 16px;
    display: flex;
    align-items: center;
    word-break: break-word;
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .ip-info-container {
      padding: 20px 10px;
    }

    .ip-info-card {
      border-radius: 10px;
    }

    .ip-info-title {
      font-size: 18px;
      padding: 15px;
    }

    .table-cell {
      padding: 10px 15px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .cell-label {
      flex: 0 0 100px;
      font-size: 13px;
      font-weight: 600;
    }

    .cell-value {
      flex: 1;
      font-size: 13px;
      text-align: right;
      padding-left: 10px;
    }
  }
</style>