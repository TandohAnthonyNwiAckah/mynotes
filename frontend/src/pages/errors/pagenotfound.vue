<template>
    <div class="container">
        <q-card class="q-pa-lg q-my-lg">
            <q-card-section>
                <div class="text-center">
                    <div class="text-negative text-h2 text-bold">
                       404
                    </div>
					<div class="text-accent q-pa-sm text-h6">
                        Page Not Found
                    </div>
                    <div class="text-grey  q-pa-sm">
                        Please contact system administrator for more information
                    </div>
					<q-btn to="/home"  color="primary">Go to home page</q-btn>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>
<script>
export default {
    name: "PageNotFoundComponent",
};
</script>