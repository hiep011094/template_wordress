<?php get_header(); 
$is_term = get_queried_object();
if ( ! empty( $is_term->taxonomy ) ) {
    $tax = get_taxonomy( $is_term->taxonomy );

    if ( ! empty( $tax->object_type ) ) {
        $post_type = $tax->object_type[0];
        $obj = get_post_type_object( $post_type );
    }
}
$terms_cate = get_terms( [
    'taxonomy'   => 'labo_cate',
    'hide_empty' => false,
] );

$terms_tags = get_terms( [
    'taxonomy'   => 'labo_tags',
    'hide_empty' => false,
] );

$paged = get_query_var('paged') ? get_query_var('paged') : 1;  

$args_labo = array(
    'post_type' => 'labo', 
    'posts_per_page' => $wp_query->query_vars['posts_per_page'],
    'paged'          => $paged,
    'post_status'    => 'publish',
    'tax_query' => [
        [
            'taxonomy' => $is_term->taxonomy,
            'field'    => 'term_id',
            'terms'    => $is_term->term_id,
        ]
    ]
);      
$query_labo = new WP_Query($args_labo);
?>
<main class="p-labo p-labo--tax">   
    <section class="p-labo__mv">
        <ul class="c-bread">
            <li class="c-bread__item"><a href="<?php echo esc_url(home_url('/')); ?>" class="c-bread__link">オフセット岩村 TOP</a></li>
            <li class="c-bread__item"><a href="<?php echo esc_url(home_url('/'.esc_html($obj->name).'/')); ?>" class="c-bread__link"><?php echo esc_html($obj->labels->name); ?></a></li>
            <li class="c-bread__item"><?php echo esc_html( single_term_title( '', false ) ); ?></li>
        </ul>
        <div class="l-container">
            <div class="p-labo__head js-rotate active">
                <figure class="p-labo__head__img">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/top/img_11.svg" alt="">
                </figure>
                <div class="p-labo__head__content">
                    <h2 class="c-title01">
                        <span class="c-title01__en">
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/top/img_lab.svg" alt="">
                        </span>
                        <span class="c-title01__small">オフセット岩村の</span>
                        <span class="c-title01__jp">印刷研究ラボ</span>
                    </h2>
                </div>
                <svg class="p-labo__head__icon" xmlns="http://www.w3.org/2000/svg" width="1013.18" height="1013.469" viewBox="0 0 1013.18 1013.469">
                    <path d="M1465.229,1154.332a73.863,73.863,0,0,1-52.39-21.64L1098.022,817.875c-155.084,102.693-360.944,74.6-483.378-67.766-118.259-137.43-117.783-344.335.948-481.29,68.146-78.681,162.771-123.953,266.224-127.654,101.838-3.417,201.969,35.686,274.2,107.913A367.868,367.868,0,0,1,1202.9,713.094l314.817,314.818a74.078,74.078,0,0,1-52.391,126.515Zm-365.5-369.106a14.151,14.151,0,0,1,10.06,4.176l323.169,323.169a45.7,45.7,0,0,0,64.634-64.634L1174.425,724.768a14.141,14.141,0,0,1-1.518-18.318A340.339,340.339,0,0,0,882.956,169.543c-95.48,3.417-182.8,45.272-245.723,117.879-109.621,126.42-109.906,317.285-.855,444.085,115.506,134.2,311.211,158.405,455.285,56.282a13.816,13.816,0,0,1,8.257-2.658Z" transform="translate(-526.246 -140.958)" fill="#353786"/>
                    <path d="M962,590.816a14.316,14.316,0,0,1-10.061-4.176,14.149,14.149,0,0,1,0-20.121c87.982-87.982,87.982-231.107,0-318.993-87.982-87.982-231.012-87.982-318.993,0-56.187,56.187-78.491,135.912-59.6,213.263a14.214,14.214,0,1,1-27.619,6.739c-21.26-87.033,3.891-176.818,67.1-240.123,99.086-99.086,260.244-99.086,359.235,0,99.087,99.086,99.087,260.244,0,359.235A14.317,14.317,0,0,1,962,590.816Z" transform="translate(-423.73 -37.947)" fill="#353786"/>
                    <path d="M587.484,258.4a14.316,14.316,0,0,1-10.061-4.176,256.369,256.369,0,0,1-32.554-39.862,14.255,14.255,0,0,1,23.823-15.66,228.979,228.979,0,0,0,28.947,35.4,14.149,14.149,0,0,1,0,20.121,14.318,14.318,0,0,1-10.061,4.176Z" transform="translate(-388.325 294.47)" fill="#353786"/>
                </svg>
            </div>
            <div class="p-labo__list">
                <div class="p-labo__list__item">
                    <figure class="p-labo__list__icon">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/top/icon_01.svg" alt="">
                    </figure>
                    <p class="c-txt16 u-fw--700">する</p>
                </div>
                <div class="p-labo__list__item">
                    <figure class="p-labo__list__icon">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/top/icon_02.svg" alt="">
                    </figure>
                    <p class="c-txt16 u-fw--700">きる</p>
                </div>
                <div class="p-labo__list__item">
                    <figure class="p-labo__list__icon">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/top/icon_03.svg" alt="">
                    </figure>
                    <p class="c-txt16 u-fw--700">おる</p>
                </div>
                <div class="p-labo__list__item">
                    <figure class="p-labo__list__icon">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/top/icon_04.svg" alt="">
                    </figure>
                    <p class="c-txt16 u-fw--700">とじる</p>
                </div>
            </div>
        </div>
    </section>
    <div class="p-labo__list01">
        <?php if ( ! is_wp_error( $terms_cate ) && ! empty( $terms_cate ) ): ?>
            <div class="c-anchor js-fadein">
                <div class="c-anchor__head">印刷研究ラボ：カテゴリ</div>
                <ul class="c-anchor__list">
                    <?php foreach ( $terms_cate as $term ) : ?>
                    <li class="c-anchor__item">
                        <a href="<?php echo esc_url( home_url( 'labo/'.$term->slug.'/' ) ) ?>" class="c-anchor__link <?php echo $term->term_id == $is_term->term_id ? 'active': '' ; ?>"><?php echo esc_html( $term->name ) ?></a>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        <div class="p-labo__term  js-fadein">
            <p class="p-labo__term__left">カテゴリ：</p>
            <h2 class="p-labo__term__right"><?php echo esc_html($is_term->name) ?></h2>
        </div>
        <?php if ($query_labo->have_posts()) :?>
        <div class="c-listpost02">
            <?php while ($query_labo->have_posts()) : $query_labo->the_post(); 
                    $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'full'); 
                    $cate = get_the_terms(get_the_ID(), 'labo_cate'); 
                    $tags = get_the_terms(get_the_ID(), 'labo_tags'); 
                    $pickup = get_field('pick-up');
            ?>
            <div class="c-listpost02__item js-fadein">
                <a href="<?php echo esc_url(get_the_permalink()); ?>" class="c-listpost02__inner">
                    <?php if (!empty($cate) && is_array($cate)):?>
                    <div class="c-listpost02__cate01">
                        <?php foreach ($cate as $term):?>
                        <span class="c-listpost02__cate01__item"><?php echo esc_html($term->name); ?></span>
                        <?php endforeach; ?>  
                    </div>
                    <?php  endif; ?>
                    <figure class="c-listpost02__img">
                        <?php if($thumb_url): ?>
                        <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_html(get_the_title()) ; ?>">
                        <?php else: ?>
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/common/img_dummy_01.webp" alt="<?php echo esc_html(get_the_title()) ; ?>">
                        <?php endif; ?>
                    </figure>
                    <div class="c-listpost02__content">
                        <p class="c-listpost02__date"><?php echo esc_html(get_the_date('Y.m.d')) ; ?></p>
                        <p class="c-listpost02__ttl01"><?php echo esc_html(get_the_title()) ; ?></p>
                        <?php if (!empty($tags) && is_array($tags)):?>
                            <div class="c-listpost02__tag">
                                <?php foreach ($tags as $tag):?>
                                <span class="c-listpost02__tag__item"><?php echo esc_html($tag->name); ?></span>
                                <?php endforeach; ?>  
                            </div>
                        <?php  endif; ?>
                    </div>
                </a>
            </div>
            <?php endwhile;?>  
        </div>
        <?php else: ?>
            <p class="c-txt16 js-fadein">現在、記事はありません。</p>
        <?php endif; ?>
        <div class="c-pagination js-fadein">
            <?php
                wp_pagenavi(array('query' => $query_labo)); 
                wp_reset_postdata();
            ?> 
        </div>
    </div>
    <?php if (!empty($terms_tags) && is_array($terms_tags)):?>
    <div class="c-box02">
        <h2 class="c-box02__ttl">
            <svg class="c-box02__ttl__icon" xmlns="http://www.w3.org/2000/svg" width="100.589" height="100.618" viewBox="0 0 100.589 100.618">
                <path d="M93.223,100.608a7.333,7.333,0,0,1-5.2-2.148L56.766,67.2A36.626,36.626,0,0,1,8.87,12.694,36.352,36.352,0,0,1,35.3.021,36.624,36.624,0,0,1,67.178,56.8L98.433,88.057a7.354,7.354,0,0,1-5.2,12.561ZM56.936,63.963a1.4,1.4,0,0,1,1,.415L90.019,96.462a4.537,4.537,0,1,0,6.417-6.417L64.351,57.961a1.4,1.4,0,0,1-.151-1.819,33.8,33.8,0,1,0-8.066,8.075,1.372,1.372,0,0,1,.82-.264Z" transform="translate(0 0)" fill="#353786"/>
                <path d="M42.064,43.458a1.421,1.421,0,0,1-1-.415,1.4,1.4,0,0,1,0-2,22.394,22.394,0,1,0-37.587-10.5,1.411,1.411,0,1,1-2.742.669A25.219,25.219,0,1,1,43.062,43.043,1.421,1.421,0,0,1,42.064,43.458Z" transform="translate(11.376 11.431)" fill="#353786"/>
                <path d="M4.467,6.568a1.421,1.421,0,0,1-1-.415A25.453,25.453,0,0,1,.236,2.2,1.415,1.415,0,0,1,2.6.641,22.733,22.733,0,0,0,5.475,4.156a1.4,1.4,0,0,1,0,2,1.421,1.421,0,0,1-1,.415Z" transform="translate(15.305 48.321)" fill="#353786"/>
            </svg>
            キーワードから探す
        </h2>
        <div class="c-tags01">
            <?php foreach ($terms_tags as $tag):?>
            <a class="c-tags01__item" href="<?php echo esc_url( home_url( 'labo/'.$tag->slug.'/' ) ) ?>"><?php echo esc_html($tag->name); ?></a>
            <?php endforeach; ?>  
        </div>
    </div>
    <?php  endif; ?>
</main>
<?php get_footer(); ?>
