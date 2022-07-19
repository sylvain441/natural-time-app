<script setup>

import { computed } from '@vue/reactivity';

const props = defineProps({
  element: {
    type: Number,
    required: true
  },
  color: {
    type: Number,
    required: true
  },
})

</script>

<template>

<svg width="100%" height="100%" viewBox="0 0 100 68" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
    
    <!-- EARTH -->
    <g v-if="element == 1" transform="matrix(1,0,0,1,-3000,-3358)">
        <g id="earth" transform="matrix(0.0693461,0,0,0.0472222,2811.79,3358)">
            <rect x="2714.03" y="0" width="1442.04" height="1440" style="fill:none;"/>
            <g transform="matrix(9.97724,0,0,9.92977,1675.41,-2683.03)">
                <g transform="matrix(0.481333,0,0,0.722,0,0)">
                    <path d="M234.924,548.723L314.273,487.988L356.179,526.198L417.246,466.345L493.169,561.853" style="fill:none;stroke:black;stroke-width:20px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                </g>
                <g transform="matrix(0.481333,0,0,0.722,1.13787,-28.4698)">
                    <path d="M234.924,548.723L314.273,487.988L356.179,526.198L417.246,466.345L493.169,561.853" style="fill:none;stroke:black;stroke-width:20px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                </g>
                <g transform="matrix(0.481333,0,0,0.722,2.27575,-56.9396)">
                    <path d="M234.924,548.723L314.273,487.988L356.179,526.198L417.246,466.345L493.169,561.853" style="fill:none;stroke:black;stroke-width:20px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                </g>
            </g>
        </g>
    </g>

    <!-- WATER -->
    <g v-else-if="element == 2" transform="matrix(1,0,0,1,-3100,-3358)">
        <g id="water" transform="matrix(0.0693461,0,0,0.0472222,2911.79,3358)">
            <rect x="2714.03" y="0" width="1442.04" height="1440" style="fill:none;"/>
            <clipPath id="_clip1">
                <rect x="2714.03" y="0" width="1442.04" height="1440"/>
            </clipPath>
            <g clip-path="url(#_clip1)">
                <g transform="matrix(12.6106,0,0,12.3458,881.613,-6020.99)">
                    <g transform="matrix(0.481333,0,0,0.722,0,0)">
                        <path d="M301.886,793.225C349.672,775.253 376.816,770.325 419.457,793.22C462.098,816.115 513.467,790.421 531.846,781.472" style="fill:none;stroke:black;stroke-width:20px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                    </g>
                    <g transform="matrix(0.481333,0,0,0.722,1.83233,-24.4784)">
                        <path d="M301.886,793.225C349.672,775.253 376.816,770.325 419.457,793.22C462.098,816.115 513.467,790.421 531.846,781.472" style="fill:none;stroke:black;stroke-width:20px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                    </g>
                    <g transform="matrix(0.481333,0,0,0.722,3.66465,-48.9568)">
                        <path d="M301.886,793.225C349.672,775.253 376.816,770.325 419.457,793.22C462.098,816.115 513.467,790.421 531.846,781.472" style="fill:none;stroke:black;stroke-width:20px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                    </g>
                </g>
            </g>
        </g>
    </g>

    <!-- AIR -->
    <g v-else-if="element == 3" transform="matrix(1,0,0,1,-3200,-3358)">
        <g id="air" transform="matrix(0.0693461,0,0,0.0472222,3011.79,3358)">
            <rect x="2714.03" y="0" width="1442.04" height="1440" style="fill:none;"/>
            <g transform="matrix(10.1559,0,0,11.8223,1318.83,-8154.52)">
                <g transform="matrix(0.481333,0,0,0.722,0,0)">
                    <path d="M327.174,1071.54C327.174,1071.54 482.34,1069.77 508.112,1069.23C561.59,1068.11 534.308,1133.65 505.65,1103.96" style="fill:none;stroke:black;stroke-width:21.65px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                </g>
                <g transform="matrix(0.481333,0,0,-0.722,0,1524.64)">
                    <path d="M327.174,1071.54C327.174,1071.54 482.34,1069.77 508.112,1069.23C561.59,1068.11 534.308,1133.65 505.65,1103.96" style="fill:none;stroke:black;stroke-width:21.65px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                </g>
                <g transform="matrix(0.481333,0,0,-0.722,0,1501.31)">
                    <path d="M327.174,1071.54C327.174,1071.54 422.518,1069.77 448.291,1069.23C501.769,1068.11 474.486,1133.65 445.829,1103.96" style="fill:none;stroke:black;stroke-width:21.65px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                </g>
            </g>
        </g>
    </g>

    <!-- FIRE -->
    <g v-else-if="element == 4" transform="matrix(1,0,0,1,-3300,-3358)">
        <g id="fire" transform="matrix(0.0693461,0,0,0.0472222,3111.79,3358)">
            <rect x="2714.03" y="0" width="1442.04" height="1440" style="fill:none;"/>
            <clipPath id="_clip1">
                <rect x="2714.03" y="0" width="1442.04" height="1440"/>
            </clipPath>
            <g clip-path="url(#_clip1)">
                <g transform="matrix(4.70874e-16,-11.2927,11.6284,1.04562e-15,-2914.23,3006.6)">
                    <g transform="matrix(0.481333,0,0,0.722,0,0)">
                        <path d="M301.886,793.225C349.672,775.253 376.816,770.325 419.457,793.22C462.098,816.115 513.467,790.421 531.846,781.472" style="fill:none;stroke:black;stroke-width:18.48px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                    </g>
                    <g transform="matrix(0.481333,0,0,0.722,1.83233,-24.4784)">
                        <path d="M301.886,793.225C349.672,775.253 376.816,770.325 419.457,793.22C462.098,816.115 513.467,790.421 531.846,781.472" style="fill:none;stroke:black;stroke-width:18.48px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                    </g>
                    <g transform="matrix(0.481333,0,0,0.722,3.66465,-48.9568)">
                        <path d="M301.886,793.225C349.672,775.253 376.816,770.325 419.457,793.22C462.098,816.115 513.467,790.421 531.846,781.472" style="fill:none;stroke:black;stroke-width:18.48px;" :style="{stroke: 'var(--color-'+color+')'}"/>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>

</template>
