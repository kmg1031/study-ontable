<!-- src/components/OptionModal.vue -->
<template>
    <div class="modal-overlay" v-if="visible">
        <div class="modal-content">
            <h2>{{ menu.name }} 옵션 선택</h2>
            <div class="options">
                <!-- 옵션 선택 폼 -->
                <div v-for="(optionGroup, index) in menu.options" :key="index" class="option-group">
                    <h3>
                        {{ optionGroup.name }}
                        <span v-if="optionGroup.required" style="color: red;">*</span>
                    </h3>
                    <div v-for="option in optionGroup.items" :key="option.value" class="option-item">
                        <label>
                            <input
                            type="radio"
                            :name="optionGroup.name"
                            :value="option.value"
                            v-model="selectedOptions[optionGroup.name]"
                            />
                            {{ option.label }} (₩{{ option.price.toLocaleString() }})
                        </label>
                    </div>
                </div>
            </div>
            <div class="quantity-selector">
                <label for="quantity">수량:</label>
                <input
                    type="number"
                    id="quantity"
                    v-model.number="quantity"
                    min="1"
                    :max="maxQuantity"
                />
            </div>
            <p>총 가격: ₩{{ totalPrice.toLocaleString() }}</p>
            <div class="modal-actions">
                <button @click="confirmSelection" class="btn-confirm">확인</button>
                <button @click="closeModal" class="btn-cancel">취소</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OptionModal',
    props: {
    visible: {
        type: Boolean,
        default: false,
    },
    menu: {
        type: Object,
        required: true,
    },
    },
    data() {
        return {
            selectedOptions: {},
            quantity: 1, // 수량 초기값
        };
    },
    computed: {
        totalPrice() {
            let price = this.menu.price;
            // 옵션 가격 합산
            for (const groupName in this.selectedOptions) {
                const value = this.selectedOptions[groupName];
                const optionGroup = this.menu.options.find(group => group.name === groupName);
                if (optionGroup) {
                    const optionItem = optionGroup.items.find(item => item.value === value);
                    if (optionItem) {
                        price += optionItem.price || 0;
                    }
                }
            }
            // 수량 곱하기
            return price * this.quantity;
        },
    },
    methods: {
        confirmSelection() {
            // 유효성 검사
            for (const optionGroup of this.menu.options) {
                if (optionGroup.required && !this.selectedOptions[optionGroup.name]) {
                    alert(`"${optionGroup.name}" 옵션을 선택해주세요.`);
                    return;
                }
            }

            // 선택한 옵션과 수량을 함께 이벤트 발생
            this.$emit('confirm', {
                menu: this.menu,
                options: this.selectedOptions,
                quantity: this.quantity,
            });
            this.closeModal();
        },
        closeModal() {
            this.$emit('close');
            this.selectedOptions = {};
        },
    },
};
</script>
  
<style scoped>
    /* 모달 스타일 */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background-color: #fff;
        padding: 20px;
        width: 90%;
        max-width: 400px;
        border-radius: 5px;
    }
    
    .modal-actions {
        margin-top: 20px;
        text-align: right;
    }
    
    .btn-confirm,
    .btn-cancel {
        padding: 10px 20px;
        margin-left: 10px;
    }
        
    .btn-confirm {
        background-color: #007bff;
        color: #fff;
        border: none;
    }
  
    .btn-cancel {
        background-color: #ccc;
        color: #333;
        border: none;
    }
    .quantity-selector {
        margin-top: 15px;
    }

    .quantity-selector input {
        width: 60px;
        margin-left: 10px;
    }
</style>
  