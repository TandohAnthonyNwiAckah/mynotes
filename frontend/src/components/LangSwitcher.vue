<template>
    <q-btn-dropdown no-caps color="accent" glossy flat :label="langName">
        <q-list dense>
            <q-item
                v-for="(locale, key) in locales"
                :key="key"
                clickable
                v-close-popup
                @click="changeLocale(key)"
            >
                <q-item-section>
                    <q-item-label>{{ locale }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>

<script>
export default {
    data() {
        return {
            locales: this.$menus.locales,
        };
    },
    computed: {
        langName() {
            let lang = this.$i18n.locale
            let name = this.locales[lang] || lang;
            return name;
        },
    },
    methods: {
        changeLocale(locale) {
            this.$localStore.setLocale(locale);
            window.location.reload();
        },
    }
};
</script>